import React from "react"
import { useContext, useState } from "react";
import { TreeContext } from "./TreeProvider";
import { ChevronRight, ChevronDown } from "lucide-react";
import "./treeItem.css";
import classNames from "classnames";


export default function TreeItem({ itemId, label, children }) {
  const { selected, setSelected } = useContext(TreeContext);
  const [expand, setExpand] = useState(false);

  return (
    <>
      <div
        className={classNames(
          "tree-item",
          selected === itemId && "tree-item-active"
        )}
        onClick={() => {
          setSelected(itemId);
          if (children) setExpand(!expand);
        }}
      >
        {children ? (
          expand ? (
            <ChevronDown className="tree-item-icon" />
          ) : (
            <ChevronRight className="tree-item-icon" />
          )
        ) : (
          <div className="tree-item-icon" />
        )}
        <span>{label}</span>
      </div>
      {expand && <div className="tree-item-child">{children}</div>}
    </>
  );
}
