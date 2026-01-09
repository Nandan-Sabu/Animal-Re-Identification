import React, { useContext } from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import TreeProvider, { TreeContext } from "./TreeProvider"

function TestComponent() {
  const { selected, setSelected } = useContext(TreeContext)
  return (
    <div>
      <span data-testid="selected">{selected}</span>
      <button onClick={() => setSelected("node1")}>Select Node1</button>
    </div>
  )
}

describe("TreeProvider", () => {
  it("provides selected state and updater", () => {
    render(
      <TreeProvider>
        <TestComponent />
      </TreeProvider>
    )
    expect(screen.getByTestId("selected").textContent).toBe("")
    fireEvent.click(screen.getByText("Select Node1"))
    expect(screen.getByTestId("selected").textContent).toBe("node1")
  })
})