import { Box } from "@mui/material";
import React from "react";
import { useComponentsContext } from "../ComponentsAccess";
import { useDrawing } from "./useDrawing";
import { useHistoryOperations } from "./HistoryOperations";
import DrawingCanvas from "./DrawingCanvas";
import ControlPanel from "./ControlPanel";
import PageNavigation from "./PageNavigation";

export default function Home() {
  const {
    BrushColor,
    BrushSize,
    setBrushSize,
    Tool,
    pages,
    setPages,
    undo,
    setUndo,
    redo,
    setRedo,
  } = useComponentsContext();

  // Use the drawing hook
  const {
    currentPage,
    setCurrentPage,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDrawing(
    Tool, 
    BrushColor, 
    BrushSize, 
    setBrushSize, 
    pages, 
    setPages, 
    setUndo, 
    setRedo
  );

  // Use the history operations hook
  const { addNewPage, handleUndo, handleRedo } = useHistoryOperations(
    currentPage,
    setCurrentPage,
    pages,
    setPages,
    undo,
    setUndo,
    redo,
    setRedo
  );

  return (
    <Box 
      sx={{ 
        width: "100%",
        height: "calc(100vh - 64px)", // Account for fixed AppBar height
        pt: "80px", // Increased top padding to account for fixed AppBar
        overflowY: "auto"
      }}
    >
      <PageNavigation 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pages={pages}
        setRedo={setRedo}
      />
      <DrawingCanvas
        pages={pages}
        currentPage={currentPage}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
      />
      <ControlPanel
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        addNewPage={addNewPage}
      />
    </Box>
  );
} 