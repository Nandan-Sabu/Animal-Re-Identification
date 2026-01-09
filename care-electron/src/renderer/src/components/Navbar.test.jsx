import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    expect(screen.getByText(/Home/i)).toBeInTheDocument()
    expect(screen.getByText(/About/i)).toBeInTheDocument()
    expect(screen.getByText(/User Guide/i)).toBeInTheDocument()
    expect(screen.getByText(/Upload Files/i)).toBeInTheDocument()
    expect(screen.getByText(/Gallery View/i)).toBeInTheDocument()
    expect(screen.getByText(/Detect Result/i)).toBeInTheDocument()
    expect(screen.getByText(/ReID Result/i)).toBeInTheDocument()
    expect(screen.getByText(/Settings/i)).toBeInTheDocument()
  })
  it('toggles between expanded and collapsed states', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )
    const nav = screen.getByRole('navigation')
    const toggleButton = screen.getByRole('button', { name: /care/i })

    expect(nav.className).toMatch(/navbar--expanded/)
    // Click toggle --> collapse
    fireEvent.click(toggleButton)
    expect(nav.className).toMatch(/navbar--collapsed/)
    // Click toggle --> expand
    fireEvent.click(toggleButton)
    expect(nav.className).toMatch(/navbar--expanded/)
  })
  it('marks the active NavLink', () => {
    render(
      <MemoryRouter initialEntries={['/upload']}>
        <Navbar />
      </MemoryRouter>
    )
    const uploadLink = screen.getByText(/Upload Files/i)
    expect(uploadLink.closest('a')).toHaveClass('navbar__item--active')
  })
})
