import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import BrushIcon from "@mui/icons-material/Brush";
import BackspaceIcon from "@mui/icons-material/Backspace";

const ToolsSelection = ({ Tool, setTool }) => {
  return (
    <Box>
      <Tooltip title="Pen Tool">
        <IconButton
          color="inherit"
          onClick={() => setTool("pen")}
          sx={{ ...(Tool === "pen" && { border: "1px solid white" }) }}
        >
          <BrushIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Eraser">
        <IconButton
          color="inherit"
          onClick={() => setTool("eraser")}
          sx={{ ...(Tool === "eraser" && { border: "1px solid white" }) }}
        >
          <BackspaceIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ToolsSelection; 