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

  // Ref to track whether a drawing/erasing gesture is in progress.
  const isDrawing = useRef(false);
  // Ref to store the current eraser stroke (only used when Tool is "eraser")
  const eraserStroke = useRef([]);

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

  // Local state for current page index
  const [currentPage, setCurrentPage] = useState(0);

  // Helper function to compute bounding box from a set of points
  const computeBoundingBox = (points) => {
    const xs = points.filter((_, i) => i % 2 === 0);
    const ys = points.filter((_, i) => i % 2 === 1);
    return {
      x1: Math.min(...xs),
      y1: Math.min(...ys),
      x2: Math.max(...xs),
      y2: Math.max(...ys),
    };
  };

  // Helper to check if two boxes intersect
  const boxesIntersect = (box1, box2) => {
    return (
      box1.x1 < box2.x2 &&
      box1.x2 > box2.x1 &&
      box1.y1 < box2.y2 &&
      box1.y2 > box2.y1
    );
  };

  // Handle mouse/touch down event
  const handleMouseDown = useCallback(
    (e) => {
      e.evt.preventDefault();
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      // Clear redo stack on new action
      setRedo([]);

      if (Tool === "pen") {
        // Start a new stroke for pen
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
      } else if (Tool === "eraser") {
        // Initialize eraser stroke (we won't add it to pages)
        eraserStroke.current = [pos.x, pos.y];
      }
    },
    [Tool, BrushColor, BrushSize, currentPage, setRedo, setPages]
  );

  // Handle mouse/touch move event
  const handleMouseMove = useCallback(
    (e) => {
      e.evt.preventDefault();
      if (!isDrawing.current) return;
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();

      if (Tool === "pen") {
        // Append points to the current pen stroke
        setPages((prevPages) => {
          const newPages = [...prevPages];
          const currentLines = newPages[currentPage];
          const lastLine = currentLines[currentLines.length - 1];
          lastLine.points = lastLine.points.concat([point.x, point.y]);
          return newPages;
        });
      } else if (Tool === "eraser") {
        // Append points to the eraser stroke
        eraserStroke.current.push(point.x, point.y);
        // Optionally, you could render the eraser stroke for feedback here
      }
    },
    [Tool, currentPage, setPages]
  );

  // Handle mouse/touch up event
  const handleMouseUp = useCallback(() => {
    if (Tool === "pen") {
      isDrawing.current = false;
      // Save the completed pen stroke into the undo stack.
      setUndo((prevUndo) => {
        const currentLines = pages[currentPage];
        if (currentLines.length === 0) return prevUndo;
        const lastLine = currentLines[currentLines.length - 1];
        // Append the new action and trim to last 10 actions
        return [...prevUndo, { page: currentPage, line: lastLine }].slice(-10);
      });
    } else if (Tool === "eraser") {
      isDrawing.current = false;
      // If no eraser stroke was drawn, do nothing.
      if (eraserStroke.current.length < 2) return;

      // Compute the bounding box of the eraser stroke.
      const eraserBox = computeBoundingBox(eraserStroke.current);

      // Remove strokes from the current page that intersect with the eraser box.
      setPages((prevPages) => {
        const newPages = [...prevPages];
        const originalStrokes = newPages[currentPage];
        const strokesToKeep = [];
        const erasedStrokes = [];
        originalStrokes.forEach((stroke) => {
          const strokeBox = computeBoundingBox(stroke.points);
          if (boxesIntersect(eraserBox, strokeBox)) {
            erasedStrokes.push(stroke);
          } else {
            strokesToKeep.push(stroke);
          }
        });

        // Optionally, push the erased strokes into the undo stack so you can restore them.
        if (erasedStrokes.length > 0) {
          setUndo((prevUndo) =>
            [...prevUndo, { page: currentPage, erased: erasedStrokes }].slice(-10)
          );
        }
        newPages[currentPage] = strokesToKeep;
        return newPages;
      });
    }
  }, [Tool, currentPage, pages, setPages, setUndo]);

  // Add new page handler remains unchanged.
  const addNewPage = () => {
    setPages([...pages, []]);
    setCurrentPage(pages.length); // Switch to the new page
    // Clear redo when switching pages
    setRedo([]);
  };

  // Undo/redo functions remain similar (note that undo actions for eraser now contain an "erased" array)
  const handleUndo = () => {
    setUndo((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;
      const lastAction = prevUndo[prevUndo.length - 1];
      // Only undo if the last action belongs to the current page
      if (lastAction.page !== currentPage) return prevUndo;

      // Depending on whether the action was a pen stroke or an eraser action, undo appropriately.
      if (lastAction.line) {
        // Undo for pen stroke: remove the last line
        setPages((prevPages) => {
          const newPages = [...prevPages];
          newPages[currentPage] = newPages[currentPage].slice(0, -1);
          return newPages;
        });
      } else if (lastAction.erased) {
        // Undo for eraser action: restore the erased strokes
        setPages((prevPages) => {
          const newPages = [...prevPages];
          newPages[currentPage] = [...newPages[currentPage], ...lastAction.erased];
          return newPages;
        });
      }
      // Push the undone action to the redo stack (limit to 10 actions)
      setRedo((prevRedo) => [...prevRedo, lastAction].slice(-10));
      return prevUndo.slice(0, -1);
    });
  };

  const handleRedo = () => {
    setRedo((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const lastAction = prevRedo[prevRedo.length - 1];
      if (lastAction.page !== currentPage) return prevRedo;
      const newRedo = prevRedo.slice(0, -1);
      // Reapply the undone action.
      if (lastAction.line) {
        setPages((prevPages) => {
          const newPages = [...prevPages];
          newPages[currentPage] = [...newPages[currentPage], lastAction.line];
          return newPages;
        });
      } else if (lastAction.erased) {
        setPages((prevPages) => {
          const newPages = [...prevPages];
          // Remove strokes matching those in lastAction.erased.
          newPages[currentPage] = newPages[currentPage].filter(
            (stroke) =>
              !lastAction.erased.some(
                (erasedStroke) => erasedStroke === stroke
              )
          );
          return newPages;
        });
      }
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
                    // For pen strokes, use normal composite; eraser actions are now handled by removing objects.
                    "source-over"
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
