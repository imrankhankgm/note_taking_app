import { Box, Paper, IconButton } from "@mui/material";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Stage, Layer, Line } from "react-konva";
import { useComponentsContext } from "./ComponentsAccess";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

export default function Home() {
  const {
    BrushColor,
    BrushSize,
    setBrushSize, // Ensure your context provides this setter
    Tool,
    pages,
    setPages,
    undo,
    setUndo,
    redo,
    setRedo,
  } = useComponentsContext();

  // Local states to remember the last BrushSize for each tool
  const [penBrushSize, setPenBrushSize] = useState(BrushSize);
  const [eraserBrushSize, setEraserBrushSize] = useState(BrushSize);

  // useRef to track the previous tool so we can detect when it changes
  const prevTool = useRef(Tool);

  // Update saved brush size whenever BrushSize changes
  useEffect(() => {
    if (Tool === "pen") {
      setPenBrushSize(BrushSize);
    } else if (Tool === "eraser") {
      setEraserBrushSize(BrushSize);
    }
  }, [BrushSize, Tool]);

  // Restore the last saved BrushSize when the tool changes.
  useEffect(() => {
    if (prevTool.current !== Tool) {
      if (Tool === "pen") {
        setBrushSize(penBrushSize);
      } else if (Tool === "eraser") {
        setBrushSize(eraserBrushSize);
      }
      prevTool.current = Tool;
    }
  }, [Tool, penBrushSize, eraserBrushSize, setBrushSize]);

  const isDrawing = useRef(false);

  // State for multiple pages; each page holds its own array of lines
  const [currentPage, setCurrentPage] = useState(0);

  const handleMouseDown = useCallback(
    (e) => {
      e.evt.preventDefault();
      isDrawing.current = true;
      // Clear redo since new drawing invalidates any "redo" actions
      setRedo([]);
      const pos = e.target.getStage().getPointerPosition();
      setPages((prevPages) => {
        const newPages = [...prevPages];
        newPages[currentPage] = [
          ...newPages[currentPage],
          {
            tool: Tool,
            points: [pos.x, pos.y],
            color: BrushColor,
            size: BrushSize,
          },
        ];
        return newPages;
      });
    },
    [Tool, BrushColor, BrushSize, currentPage, setRedo, setPages]
  );

  const handleMouseMove = useCallback(
    (e) => {
      e.evt.preventDefault();
      if (!isDrawing.current) return;
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();

      setPages((prevPages) => {
        const newPages = [...prevPages];
        const currentLines = newPages[currentPage];
        const lastLine = currentLines[currentLines.length - 1];
        lastLine.points = lastLine.points.concat([point.x, point.y]);
        return newPages;
      });
    },
    [currentPage, setPages]
  );

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
    // Save the completed stroke into the undo stack.
    // (Each action is an object with the page index and the stroke data.)
    setUndo((prevUndo) => {
      const currentLines = pages[currentPage];
      if (currentLines.length === 0) return prevUndo;
      const lastLine = currentLines[currentLines.length - 1];
      // Append the new action and trim to last 10 actions
      return [...prevUndo, { page: currentPage, line: lastLine }].slice(-10);
    });
  }, [pages, currentPage, setUndo]);

  const addNewPage = () => {
    setPages([...pages, []]);
    setCurrentPage(pages.length); // Switch to the new page
    // Clear redo when switching pages
    setRedo([]);
  };

  const handleUndo = () => {
    setUndo((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;
      const lastAction = prevUndo[prevUndo.length - 1];
      // Only undo if the last action belongs to the current page
      if (lastAction.page !== currentPage) return prevUndo;
      // Remove the stroke from the current page
      setPages((prevPages) => {
        const newPages = [...prevPages];
        newPages[currentPage] = newPages[currentPage].slice(0, -1);
        return newPages;
      });
      // Push the undone stroke to the redo stack (limit to 10 actions)
      setRedo((prevRedo) => [...prevRedo, lastAction].slice(-10));
      return prevUndo.slice(0, -1);
    });
  };

  // Simplified redo: pop the last action from redo (if it belongs to the current page)
  const handleRedo = () => {
    setRedo((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const lastAction = prevRedo[prevRedo.length - 1];
      if (lastAction.page !== currentPage) return prevRedo;
      const newRedo = prevRedo.slice(0, -1);
      // Reapply the undone stroke to the current page
      setPages((prevPages) => {
        const newPages = [...prevPages];
        newPages[currentPage] = [...newPages[currentPage], lastAction.line];
        return newPages;
      });
      // Push the action back to the undo stack (limit to 10 actions)
      setUndo((prevUndo) => [...prevUndo, lastAction].slice(-10));
      return newRedo;
    });
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 1,
          overflowX: "auto",
        }}
      >
        {/* Undo and Redo buttons */}
        <IconButton
          onClick={handleUndo}
          disabled={undo.filter((a) => a.page === currentPage).length === 0}
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          onClick={handleRedo}
          disabled={redo.filter((a) => a.page === currentPage).length === 0}
        >
          <RedoIcon />
        </IconButton>

        {/* Page navigation */}
        {pages.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => {
              setCurrentPage(index);
              // Clear redo when switching pages
              setRedo([]);
            }}
            color={index === currentPage ? "primary" : "default"}
          >
            {index + 1}
          </IconButton>
        ))}
        <IconButton sx={{ backgroundColor: "white" }} onClick={addNewPage}>
          <AddCircleIcon fontSize="large" color="primary" />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          m: 3,
          width: "100%",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            width: "827px",
            height: "1169px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stage
            width={827}
            height={1169}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <Layer>
              {pages[currentPage].map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.size}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={
                    line.tool === "eraser" ? "destination-out" : "source-over"
                  }
                />
              ))}
            </Layer>
          </Stage>
        </Paper>
      </Box>
    </div>
  );
}
