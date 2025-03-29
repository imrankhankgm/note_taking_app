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
  // A4 paper is 210mm × 297mm (8.27 × 11.69 inches)
  // At 100 DPI, that's 827 × 1169 pixels
  const a4Width = 827; // A4 width at 100 DPI
  const a4Height = 1169; // A4 height at 100 DPI

  // Limit canvas width based on window size while maintaining A4 proportions
  const canvasWidth = Math.min(window.innerWidth * 0.8, a4Width);
  // Scale height proportionally if width is constrained by window size
  const scale = canvasWidth / a4Width;
  const canvasHeight = a4Height * scale;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        padding: "0 16px 80px 16px",
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
                lineJoin="round"
                shadowColor="black"
                shadowBlur={0}
                shadowOpacity={0}
                shadowOffsetX={0}
                shadowOffsetY={0}
                globalCompositeOperation={
                  "source-over"
                }
                listening={false}
                perfectDrawEnabled={true}
                bezier={true}
              />
            ))}
          </Layer>
        </Stage>
      </Paper>
    </Box>
  );
};

export default DrawingCanvas; 