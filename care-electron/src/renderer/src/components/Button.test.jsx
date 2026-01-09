import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children text', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })
  it('applies primary variant styles', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole('button', { name: /Primary/i })
    expect(button).toHaveClass('button--primary')
  })
  it('applies secondary variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button', { name: /Secondary/i })
    expect(button).toHaveClass('button--secondary')
  })
  it('renders as a Link when isLink=true', () => {
    render(
      <MemoryRouter>
        <Button isLink href="/about">Go About</Button>
      </MemoryRouter>
    )
    const link = screen.getByRole('link', { name: /Go About/i })
    expect(link).toHaveAttribute('href', '/about')
    expect(link).toHaveClass('button')
  })
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    fireEvent.click(screen.getByRole('button', { name: /Click/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
  it('applies aria-label when provided', () => {
    render(<Button ariaLabel="Submit Form">Submit</Button>)
    const button = screen.getByRole('button', { name: /Submit Form/i })
    expect(button).toBeInTheDocument()
  })
})
