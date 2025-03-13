import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import BrushIcon from "@mui/icons-material/Brush";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LogoDevIcon from "@mui/icons-material/Notes";
import BackspaceIcon from "@mui/icons-material/Backspace";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Popover from "@mui/material/Popover";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";
import { useComponentsContext } from "./ComponentsAccess";
import { useState } from "react";

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenColorPicker = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseColorPicker = () => {
    setAnchorEl(null);
  };

  const [fileName, setFileName] = useState("");

  const handleSave = async () => {
    try {
      const now = new Date();
      const formattedDate = now.toISOString().replace(/[:.]/g, "-"); // Format: YYYY-MM-DDTHH-MM-SS
      let fName;
      if (fileName) {
        fName = fileName;
      } else {
        fName = `drawing_${formattedDate}.json`;
      }

      // Convert the pages array to JSON
      const json = JSON.stringify(pages, null, 2);

      // If the File System Access API is available
      if (window.showSaveFilePicker) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: fName,
          types: [
            {
              description: "JSON File",
              accept: { "application/json": [".json"] },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(json);
        await writable.close();

        alert("File saved successfully.");
      } else {
        // Fallback for browsers that don’t support the File System Access API
        const blob = new Blob([json], { type: "application/json" });
        const a = document.createElement("a");
        const url = URL.createObjectURL(blob);
        a.href = url;
        a.download = fName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert("File saved successfully.");
      }
    } catch (error) {
      console.error("Error saving file:", error);
      alert("Failed to save file.");
    }
  };

  // Function to load the saved drawing state (compatible with all browsers)
  const handleLoad = () => {
    try {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "application/json";

      input.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const loadedData = JSON.parse(e.target.result);
            setPages(loadedData);
            console.log(file);
            setFileName(file.name);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Invalid file format.");
          }
        };

        reader.readAsText(file);
      });

      input.click();
    } catch (error) {
      console.error("Error loading file:", error);
      alert("Failed to load file.");
    }
  };

  // Fixed list of brush sizes
  const brushSizes = [2, 5, 8, 11, 14, 25];

  return (
    <AppBar position="static">
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

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Tooltip title="Color Picker">
              <IconButton color="inherit" onClick={handleOpenColorPicker}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: BrushColor,
                    border: "1px solid white",
                  }}
                />
              </IconButton>
            </Tooltip>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleCloseColorPicker}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              disablePortal={true} // Keeps the popover inside the AppBar
              container={anchorEl}
            >
              <ChromePicker
                color={BrushColor}
                onChange={(newColor) => setBrushColor(newColor.hex)}
              />
            </Popover>
            {/* Fixed Brush Size Options */}
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
          </Box>

          <Box>
            <Tooltip title="Load" onClick={handleLoad}>
              {!isMobile ? (
                <Button color="inherit" startIcon={<UploadFileIcon />}>
                  {!isMobile ? "Load" : ""}
                </Button>
              ) : (
                <IconButton color="inherit">
                  <UploadFileIcon />
                </IconButton>
              )}
            </Tooltip>
            <Tooltip title="Save" onClick={handleSave}>
              {!isMobile ? (
                <Button color="inherit" startIcon={<SaveIcon />}>
                  {!isMobile ? "Save" : ""}
                </Button>
              ) : (
                <IconButton color="inherit">
                  <SaveIcon />
                </IconButton>
              )}
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default CustomAppBar;
