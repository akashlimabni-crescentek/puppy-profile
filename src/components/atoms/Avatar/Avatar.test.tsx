import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders the image with correct alt text', () => {
    render(<Avatar src="https://example.com/dog.jpg" alt="Maple" />)
    expect(screen.getByAltText('Maple')).toBeInTheDocument()
  })

  it('renders the Lucide placeholder when src is null', () => {
    const { container } = render(<Avatar src={null} alt="Maple" />)
    expect(screen.queryByAltText('Maple')).not.toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Maple' })).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders the Lucide placeholder when the image fails to load', async () => {
    const { container } = render(<Avatar src="https://broken.invalid/dog.jpg" alt="Broken" />)
    screen.getByAltText('Broken').dispatchEvent(new Event('error'))
    await waitFor(() => expect(container.querySelector('svg')).toBeInTheDocument())
    expect(screen.queryByAltText('Broken')).not.toBeInTheDocument()
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
