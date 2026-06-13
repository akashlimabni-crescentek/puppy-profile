import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PuppyProfileCard } from './PuppyProfileCard'
import { mockPuppy, mockPuppyNoFocus } from '@utils/mockData'

describe('PuppyProfileCard', () => {
  it('renders the puppy name', () => {
    render(<PuppyProfileCard puppy={mockPuppy} familyName="Testerson" />)
    expect(screen.getByText('Maple')).toBeInTheDocument()
  })

  it('renders the breed', () => {
    render(<PuppyProfileCard puppy={mockPuppy} familyName="Testerson" />)
    expect(screen.getByText('F1 Australian Mountain Dog')).toBeInTheDocument()
  })

  it('renders the birth date in a human-readable format', () => {
    render(<PuppyProfileCard puppy={mockPuppy} familyName="Testerson" />)
    expect(screen.getByText('March 14, 2026')).toBeInTheDocument()
  })

  it('renders program progress as "Week X of Y"', () => {
    render(<PuppyProfileCard puppy={mockPuppy} familyName="Testerson" />)
    expect(screen.getByText('Week 2 of 4')).toBeInTheDocument()
  })

  it('renders the weekly focus when present', () => {
    render(<PuppyProfileCard puppy={mockPuppy} familyName="Testerson" />)
    expect(screen.getByText(mockPuppy.weeklyFocus as string)).toBeInTheDocument()
  })

  it('renders a calm empty line when weekly focus is null', () => {
    render(<PuppyProfileCard puppy={mockPuppyNoFocus} familyName="Testerson" />)
    expect(screen.getByText("This week's focus will appear here.")).toBeInTheDocument()
  })

  it('renders the family greeting', () => {
    render(<PuppyProfileCard puppy={mockPuppy} familyName="Testerson" />)
    expect(screen.getByText('Welcome, the Testerson family')).toBeInTheDocument()
  })
})
