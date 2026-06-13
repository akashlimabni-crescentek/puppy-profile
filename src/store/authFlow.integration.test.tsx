/* eslint-disable camelcase -- this file mocks the external Supabase API shape (snake_case) */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { mockPuppy } from '@utils/mockData'

/**
 * Happy-path integration test: login → fetch → render card.
 * Proves the requirement-#15 claim of exactly ONE auth call and ONE data fetch
 * per session, using a fully mocked Supabase client. The mock replaces the whole
 * client module, so validateEnv (which only runs inside it) never executes here.
 */
const signInWithPassword = vi.fn()
const maybeSingle = vi.fn()
const signOut = vi.fn().mockResolvedValue({ error: null })
const getSession = vi.fn().mockResolvedValue({ data: { session: null } })
const onAuthStateChange = vi
  .fn()
  .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })

vi.mock('@utils/supabaseClient', () => ({
  supabase: {
    auth: { signInWithPassword, signOut, getSession, onAuthStateChange },
    from: () => ({ select: () => ({ maybeSingle }) }),
  },
}))

// Imported AFTER the mock is registered so the sagas bind to the mocked client.
const { makeStore } = await import('@store/store')
const { loginRequest } = await import('@store/authSlice')
const { default: ProfilePage } = await import('@pages/ProfilePage')

/** The raw snake_case puppy row Supabase would return, derived from the fixture. */
const puppyRow = {
  id: mockPuppy.id,
  name: mockPuppy.name,
  breed: mockPuppy.breed,
  birth_date: mockPuppy.birthDate,
  sire: mockPuppy.sire,
  dam: mockPuppy.dam,
  program_type: mockPuppy.programType,
  program_length_weeks: mockPuppy.programLengthWeeks,
  current_week: mockPuppy.currentWeek,
  weekly_focus: mockPuppy.weeklyFocus,
  photo_url: mockPuppy.photoUrl,
  status: mockPuppy.status,
  family_id: mockPuppy.familyId,
  created_at: mockPuppy.createdAt,
}

/** The combined embed Supabase returns: the family row with its puppies nested. */
const familyRow = {
  id: mockPuppy.familyId,
  auth_user_id: 'u1',
  family_name: 'Testerson',
  email: 'fam@test.com',
  created_at: mockPuppy.createdAt,
  puppies: [puppyRow],
}

describe('auth → fetch → render integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    signOut.mockResolvedValue({ error: null })
    onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
  })

  it('logs in a family user, fetches once, and renders the card', async () => {
    signInWithPassword.mockResolvedValue({
      data: {
        user: { id: 'u1', email: 'fam@test.com', app_metadata: { role: 'family' } },
        session: { access_token: 'token' },
      },
      error: null,
    })
    maybeSingle.mockResolvedValue({ data: familyRow, error: null })

    const store = makeStore()
    store.dispatch(loginRequest({ email: 'fam@test.com', password: 'secret' }))

    await waitFor(() => expect(store.getState().auth.isAuthenticated).toBe(true))

    render(
      <Provider store={store}>
        <MemoryRouter>
          <ProfilePage />
        </MemoryRouter>
      </Provider>
    )

    expect(await screen.findByText(mockPuppy.name)).toBeInTheDocument()
    expect(signInWithPassword).toHaveBeenCalledTimes(1)
    expect(maybeSingle).toHaveBeenCalledTimes(1)
  })

  it('denies a non-family user and never stores a session', async () => {
    signInWithPassword.mockResolvedValue({
      data: {
        user: { id: 'u2', email: 'other@test.com', app_metadata: { role: 'staff' } },
        session: { access_token: 'token' },
      },
      error: null,
    })

    const store = makeStore()
    store.dispatch(loginRequest({ email: 'other@test.com', password: 'secret' }))

    await waitFor(() => expect(store.getState().auth.error).not.toBeNull())
    expect(store.getState().auth.isAuthenticated).toBe(false)
    expect(signOut).toHaveBeenCalledTimes(1)
  })
})
