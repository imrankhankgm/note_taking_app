import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

const BrushSizeControls = ({ BrushSize, setBrushSize }) => {
  // Fixed list of brush sizes
  const brushSizes = [2, 5, 8, 11, 14, 25];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {brushSizes.map((size) => (
        <IconButton
          key={size}
          onClick={() => setBrushSize(size)}
          color="inherit"
        >
          <Box
            sx={{
              width: size * 2,
              height: size * 2,
              borderRadius: "50%",
              backgroundColor: BrushSize === size ? "black" : "white",
              border: "2px solid white",
            }}
          />
        </IconButton>
      ))}
    </Box>
  );
};

export default BrushSizeControls; 