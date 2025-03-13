import React, { createContext, useContext, useState } from "react";

const ComponentsContext = createContext();
const useComponentsContext = () => useContext(ComponentsContext);

const ComponentsAccessProvider = ({ children }) => {
  const [BrushColor, setBrushColor] = useState("#000");
  const [BrushSize, setBrushSize] = useState(2);
  const [Tool, setTool] = useState("pen");
  const [pages, setPages] = useState([[]]);
  const [undo, setUndo] = useState([]);
  const [redo, setRedo] = useState([]);

  return (
    <ComponentsContext.Provider
      value={{
        BrushColor,
        setBrushColor,
        BrushSize,
        setBrushSize,
        Tool,
        setTool,
        pages,
        setPages,
        undo,
        setUndo,
        redo,
        setRedo,
      }}
    >
      {children}
    </ComponentsContext.Provider>
  );
};

export { ComponentsAccessProvider, useComponentsContext };
