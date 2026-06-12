import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders the label text', () => {
    render(<Badge label="Up to date" />)
    expect(screen.getByText('Up to date')).toBeInTheDocument()
  })

  it('renders the icon when provided', () => {
    render(<Badge label="Up to date" icon="✓" />)
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('applies success variant classes', () => {
    const { container } = render(<Badge label="Success" variant="success" />)
    expect(container.firstChild).toHaveClass('bg-green-100', 'text-green-800')
  })

  it('applies error variant classes', () => {
    const { container } = render(<Badge label="Error" variant="error" />)
    expect(container.firstChild).toHaveClass('bg-red-100', 'text-red-800')
  })
})
