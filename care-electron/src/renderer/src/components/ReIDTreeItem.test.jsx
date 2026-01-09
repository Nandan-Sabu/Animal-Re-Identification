import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import TreeProvider from "./TreeProvider"
import ReIDTreeItem from "./ReIDTreeItem"

describe("ReIDTreeItem", () => {
  it("renders label", () => {
    render(
      <TreeProvider>
        <ReIDTreeItem itemId="1" label="Node1" level={1} />
      </TreeProvider>
    )
    expect(screen.getByText("Node1")).toBeInTheDocument()
  })

  it("calls onDelete when delete button clicked (level 2)", () => {
    const onDelete = vi.fn()
    render(
      <TreeProvider>
        <ReIDTreeItem itemId="2" label="Node2" level={2} onDelete={onDelete} />
      </TreeProvider>
    )
    // pick the first "Delete" image
    fireEvent.click(screen.getAllByAltText("Delete")[0])
    expect(onDelete).toHaveBeenCalledWith("2")
  })

  it("calls onDownload when download button clicked (level 2)", () => {
    const onDownload = vi.fn()
    render(
      <TreeProvider>
        <ReIDTreeItem itemId="3" label="Node3" level={2} onDownload={onDownload} />
      </TreeProvider>
    )
    fireEvent.click(screen.getAllByAltText("Download")[0])
    expect(onDownload).toHaveBeenCalledWith("3")
  })

  it("calls onRename when rename button clicked (level 3)", () => {
    const onRename = vi.fn()
    render(
      <TreeProvider>
        <ReIDTreeItem itemId="4" label="Node4" level={3} onRename={onRename} />
      </TreeProvider>
    )
    fireEvent.click(screen.getAllByAltText("Rename")[0])
    expect(onRename).toHaveBeenCalledWith("4", "Node4")
  })
})