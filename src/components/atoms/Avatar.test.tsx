import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders the image with correct alt text', () => {
    render(<Avatar src="https://example.com/dog.jpg" alt="Biscuit" />)
    expect(screen.getByAltText('Biscuit')).toBeInTheDocument()
  })

  it('renders paw emoji fallback when image fails to load', async () => {
    render(<Avatar src="https://broken.invalid/dog.jpg" alt="Broken" />)
    const img = screen.getByAltText('Broken')
    img.dispatchEvent(new Event('error'))
    // After error, the paw fallback should render
    const fallback = await screen.findByText('🐾')
    expect(fallback).toBeInTheDocument()
  })

  it('applies the correct size class for each size variant', () => {
    const { container, rerender } = render(
      <Avatar src="https://example.com/dog.jpg" alt="test" size="sm" />
    )
    expect(container.firstChild).toHaveClass('w-12')

    rerender(<Avatar src="https://example.com/dog.jpg" alt="test" size="xl" />)
    expect(container.firstChild).toHaveClass('w-36')
  })
})
