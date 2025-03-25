import React from "react";
import { Stage, Layer, Line } from "react-konva";
import { Box, Paper } from "@mui/material";

const DrawingCanvas = ({ 
  pages, 
  currentPage, 
  handleMouseDown, 
  handleMouseMove, 
  handleMouseUp 
}) => {
  // A4 aspect ratio is 1:1.414 (width:height)
  // We'll set a fixed width and calculate height based on it
  const canvasWidth = Math.min(window.innerWidth * 0.8, 595); // 595px is A4 width in pixels at 72dpi
  const canvasHeight = canvasWidth * 1.414; // A4 aspect ratio

  return (
    <Box 
      sx={{ 
        width: "100%", 
        display: "flex", 
        justifyContent: "center", 
        padding: "0 16px 80px 16px", // Removed top padding since we don't need it anymore
        overflowY: "auto"
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          width: canvasWidth, 
          height: canvasHeight,
          border: "1px solid #ccc",
          borderRadius: "2px",
          overflow: "hidden",
          backgroundColor: "#fff"
        }}
      >
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
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
                globalCompositeOperation={
                  line.tool === "eraser" ? "destination-out" : "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </Paper>
    </Box>
  );
};

export default DrawingCanvas; 