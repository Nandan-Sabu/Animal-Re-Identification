import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import TreeView from "./TreeView"
import TreeItem from "./TreeItem"

describe("TreeView", () => {
  it("calls onSelectedChange when item is clicked", () => {
    const handleChange = vi.fn()
    render(
      <TreeView onSelectedChange={handleChange}>
        <TreeItem itemId="a" label="Node A" />
      </TreeView>
    )
    fireEvent.click(screen.getByText("Node A"))
    expect(handleChange).toHaveBeenCalledWith("a")
  })
})