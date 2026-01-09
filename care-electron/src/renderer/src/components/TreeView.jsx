import React from "react"
import { useContext, useEffect } from "react";
import TreeProvider, { TreeContext } from "./TreeProvider";

export default function TreeView({ onSelectedChange, children }) {
  return (
    <TreeProvider>
      <TreeInternalView onSelectedChange={onSelectedChange}>
        {children}
      </TreeInternalView>
    </TreeProvider>
  );
}

function TreeInternalView({ onSelectedChange, children }) {
  // const
  const { selected } = useContext(TreeContext);

  useEffect(() => {
    if (onSelectedChange) {
      onSelectedChange(selected);
    }
  }, [selected]);

  return children;
}
