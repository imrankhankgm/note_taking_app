import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LogoDevIcon from "@mui/icons-material/Notes";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useComponentsContext } from "../ComponentsAccess";

import ColorPicker from "./ColorPicker";
import BrushSizeControls from "./BrushSizeControls";
import ToolsSelection from "./ToolsSelection";
import FileOperations from "./FileOperations";

function CustomAppBar() {
  const {
    BrushColor,
    setBrushColor,
    BrushSize,
    setBrushSize,
    Tool,
    setTool,
    pages,
    setPages,
  } = useComponentsContext();

  // Define breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Below 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // Between 600px and 960px
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); // Above 960px

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1200,
        boxShadow: '0px 2px 8px rgba(0,0,0,0.15)'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo */}
          <LogoDevIcon sx={{ mr: 2 }} />
          {isDesktop && (
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#"
              sx={{
                mr: 2,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Notes App
            </Typography>
          )}

          <ToolsSelection Tool={Tool} setTool={setTool} />

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <ColorPicker BrushColor={BrushColor} setBrushColor={setBrushColor} />
            <BrushSizeControls BrushSize={BrushSize} setBrushSize={setBrushSize} />
          </Box>

          <FileOperations pages={pages} setPages={setPages} />
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default CustomAppBar; 