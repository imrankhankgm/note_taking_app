import { Alert, Box, Card, Paper, IconButton } from "@mui/material";
import React, { useState, useRef, useCallback } from "react";
import { Stage, Layer, Line } from "react-konva";
import { useComponentsContext } from "./ComponentsAccess";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Home() {
  const { BrushColor, BrushSize, Tool,pages, setPages } = useComponentsContext();
  const isDrawing = useRef(false);

  // State for multiple pages
   // Each page has its own lines array
  const [currentPage, setCurrentPage] = useState(0);

  const handleMouseDown = useCallback(
    (e) => {
      e.evt.preventDefault();
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      setPages((prevPages) => {
        const newPages = [...prevPages];
        newPages[currentPage] = [
          ...newPages[currentPage],
          { tool: Tool, points: [pos.x, pos.y], color: BrushColor, size: BrushSize },
        ];
        return newPages;
      });
    },
    [Tool, BrushColor, BrushSize, currentPage]
  );

  const handleMouseMove = useCallback((e) => {
    e.evt.preventDefault();
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    setPages((prevPages) => {
      const newPages = [...prevPages];
      const lastLine = newPages[currentPage][newPages[currentPage].length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      return newPages;
    });
  }, [currentPage]);

  const handleMouseUp = useCallback(() => {
    isDrawing.current = false;
  }, []);

  const addNewPage = () => {
    setPages([...pages, []]);
    setCurrentPage(pages.length); // Move to the new page
  };

  return (
    <div>
       
        <Box sx={{ display: "flex", justifyContent: "center", mt: 1, overflowX: "auto" }}>
          {pages.map((_, index) => (
            <IconButton key={index} onClick={() => setCurrentPage(index)} color={index === currentPage ? "primary" : "default"}>
              {index + 1}
            </IconButton>
          ))}
          <IconButton
          sx={{ backgroundColor: "white" }}
          onClick={addNewPage}
        >
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
          <Paper elevation={12} sx={{ width: "827px", height: "1169px", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                    globalCompositeOperation={line.tool === "eraser" ? "destination-out" : "source-over"}
                  />
                ))}
              </Layer>
            </Stage>
          </Paper>
        </Box>

    </div>
  );
}
