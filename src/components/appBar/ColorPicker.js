import React from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import { ChromePicker } from "react-color";

const ColorPicker = ({ BrushColor, setBrushColor }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleOpenColorPicker = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseColorPicker = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
        disablePortal={true}
        container={anchorEl}
      >
        <ChromePicker
          color={BrushColor}
          onChange={(newColor) => setBrushColor(newColor.hex)}
        />
      </Popover>
    </>
  );
};

export default ColorPicker; 