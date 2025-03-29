import { useCallback, useRef, useEffect, useState } from "react";
import { computeBoundingBox, boxesIntersect } from "./DrawingUtils";

export const useDrawing = (Tool, BrushColor, BrushSize, setBrushSize, pages, setPages, setUndo, setRedo) => {
  // Local states to remember the last BrushSize for each tool
  const [penBrushSize, setPenBrushSize] = useState(BrushSize);
  const [eraserBrushSize, setEraserBrushSize] = useState(BrushSize);

  // useRef to track the previous tool so we can detect when it changes
  const prevTool = useRef(Tool);

  // Ref to track whether a drawing/erasing gesture is in progress.
  const isDrawing = useRef(false);
  // Ref to store the current eraser stroke (only used when Tool is "eraser")
  const eraserStroke = useRef([]);

  // Local state for current page index
  const [currentPage, setCurrentPage] = useState(0);

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
        // Append points to the current pen stroke with more frequent sampling
        setPages((prevPages) => {
          const newPages = [...prevPages];
          const currentLines = newPages[currentPage];
          const lastLine = currentLines[currentLines.length - 1];
          
          // Get the last point
          const lastPoint = lastLine.points.slice(-2);
          const lastX = lastPoint[0];
          const lastY = lastPoint[1];
          
          // Calculate distance from last point
          const dx = point.x - lastX;
          const dy = point.y - lastY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // If distance is significant enough, add the point
          if (distance > 1) {
            lastLine.points = lastLine.points.concat([point.x, point.y]);
          }
          
          return newPages;
        });
      } else if (Tool === "eraser") {
        // Append points to the eraser stroke
        eraserStroke.current.push(point.x, point.y);
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

  return {
    currentPage,
    setCurrentPage,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
}; 