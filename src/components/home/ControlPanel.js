import React from "react";
import { Box, Paper, IconButton, Tooltip } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

const ControlPanel = ({ handleUndo, handleRedo, addNewPage }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1100,
      }}
    >
      <Paper 
        elevation={3} 
        sx={{ 
          padding: "8px", 
          borderRadius: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
          backdropFilter: "blur(4px)"
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Undo">
            <IconButton onClick={handleUndo}>
              <UndoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton onClick={handleRedo}>
              <RedoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add New Page">
            <IconButton onClick={addNewPage} color="primary">
              <AddCircleIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};

export default ControlPanel; 