import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PuppyProfileCard } from './PuppyProfileCard'
import { mockPuppy, mockPuppyFemale, mockPuppyOverdue } from '@utils/mockData'

describe('PuppyProfileCard', () => {
  it('renders the puppy name', () => {
    render(<PuppyProfileCard puppy={mockPuppy} />)
    expect(screen.getByText('Biscuit')).toBeInTheDocument()
  })

  it('renders the breed', () => {
    render(<PuppyProfileCard puppy={mockPuppy} />)
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument()
  })

  it('renders vaccination status as a badge', () => {
    render(<PuppyProfileCard puppy={mockPuppy} />)
    expect(screen.getAllByText('Up to date').length).toBeGreaterThan(0)
  })

  it('renders "Due soon" warning badge for due-soon status', () => {
    render(<PuppyProfileCard puppy={mockPuppyFemale} />)
    expect(screen.getAllByText('Due soon').length).toBeGreaterThan(0)
  })

  it('renders "Overdue" error badge for overdue status', () => {
    render(<PuppyProfileCard puppy={mockPuppyOverdue} />)
    expect(screen.getAllByText('Overdue').length).toBeGreaterThan(0)
  })

  it('renders microchip ID when present', () => {
    render(<PuppyProfileCard puppy={mockPuppy} />)
    expect(screen.getByText('MC-9876543210')).toBeInTheDocument()
  })

  it('does not render microchip row when microchipId is absent', () => {
    render(<PuppyProfileCard puppy={{ ...mockPuppy, microchipId: undefined }} />)
    expect(screen.queryByText('Microchip')).not.toBeInTheDocument()
  })
})
