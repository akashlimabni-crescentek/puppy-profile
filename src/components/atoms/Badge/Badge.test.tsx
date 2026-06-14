import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders the label text', () => {
    render(<Badge label="In school" />)
    expect(screen.getByText('In school')).toBeInTheDocument()
  })

  it('renders the icon node when provided', () => {
    render(<Badge label="In school" icon={<span data-testid="badge-icon" />} />)
    expect(screen.getByTestId('badge-icon')).toBeInTheDocument()
  })

  it('applies success variant classes', () => {
    const { container } = render(<Badge label="Success" variant="success" />)
    expect(container.firstChild).toHaveClass('bg-success/15', 'text-success')
  })

  it('applies error variant classes', () => {
    const { container } = render(<Badge label="Error" variant="error" />)
    expect(container.firstChild).toHaveClass('bg-error/15', 'text-error')
  })
})
