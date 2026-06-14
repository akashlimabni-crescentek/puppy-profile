import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('renders the registered glyph svg', () => {
    const { container } = render(<Icon name="paw" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('exposes an accessible image when a label is provided', () => {
    render(<Icon name="paw" label="Stokeshire" />)
    expect(screen.getByRole('img', { name: 'Stokeshire' })).toBeInTheDocument()
  })

  it('hides the icon from assistive tech when no label is provided', () => {
    render(<Icon name="paw" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('renders a circular medallion frame when framed is true', () => {
    const { container } = render(<Icon name="paw" framed label="Stokeshire" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('applies the tone text colour to a bare glyph', () => {
    const { container } = render(<Icon name="alertCircle" tone="muted" />)
    expect(container.querySelector('svg')).toHaveClass('text-slate')
  })
})
