import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const FileOperations = ({ pages, setPages }) => {
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
        // Fallback for browsers that don't support the File System Access API
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

  return (
    <Box>
      <Tooltip title="Save">
        <Button color="inherit" startIcon={<SaveIcon />} onClick={handleSave}>
          Save
        </Button>
      </Tooltip>
      <Tooltip title="Load">
        <Button color="inherit" startIcon={<UploadFileIcon />} onClick={handleLoad}>
          Load
        </Button>
      </Tooltip>
    </Box>
  );
};

export default FileOperations; 