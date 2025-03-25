import React from "react";
import { Box, IconButton } from "@mui/material";

const PageNavigation = ({ 
  currentPage, 
  setCurrentPage, 
  pages,
  setRedo 
}) => {
  return (
    <Box 
      sx={{ 
        width: "100%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: "10px 0",
        marginBottom: "16px",
        boxShadow: "0px 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "16px",
          padding: "2px 8px",
          overflowX: "auto",
          maxWidth: "90%",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            borderRadius: "4px"
          }
        }}
      >
        {pages.map((_, index) => (
          <IconButton
            key={index}
            onClick={() => {
              setCurrentPage(index);
              // Clear redo when switching pages
              setRedo([]);
            }}
            color={index === currentPage ? "primary" : "default"}
            size="small"
            sx={{ 
              fontWeight: index === currentPage ? "bold" : "normal",
              minWidth: "28px",
              height: "28px",
              margin: "0 1px",
              fontSize: "0.75rem"
            }}
          >
            {index + 1}
          </IconButton>
        ))}
      </Box>
    </Box>
  );
};

export default PageNavigation; 