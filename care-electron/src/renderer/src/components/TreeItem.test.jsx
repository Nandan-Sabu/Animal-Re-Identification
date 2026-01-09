import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import TreeProvider from "./TreeProvider"
import TreeItem from "./TreeItem"

describe("TreeItem", () => {
  it("renders label", () => {
    render(
      <TreeProvider>
        <TreeItem itemId="a" label="Node A" />
      </TreeProvider>
    )
    expect(screen.getByText("Node A")).toBeInTheDocument()
  })

  it("toggles expand when clicked", () => {
    render(
      <TreeProvider>
        <TreeItem itemId="parent" label="Parent">
          <div>Child</div>
        </TreeItem>
      </TreeProvider>
    )
    expect(screen.queryByText("Child")).toBeNull()
    fireEvent.click(screen.getByText("Parent"))
    expect(screen.getByText("Child")).toBeInTheDocument()
  })

  it("sets active class when selected", () => {
    render(
      <TreeProvider>
        <TreeItem itemId="x" label="X" />
      </TreeProvider>
    )
    const node = screen.getByText("X").closest("div")
    fireEvent.click(node)
    expect(node).toHaveClass("tree-item-active")
  })
})
