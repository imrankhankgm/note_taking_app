# Notes App

A modern, responsive note-taking application built with React that provides a digital canvas with drawing capabilities and multiple page support.

![Notes App Screenshot](https://via.placeholder.com/800x400?text=Notes+App+Screenshot)

## Features

- **Drawing Canvas**: A4-sized (100 DPI) drawing canvas with smooth stroke rendering
- **Multi-page Support**: Create and navigate between multiple pages
- **Tool Selection**: Switch between pen and eraser tools
- **Color Picker**: Choose custom colors for your notes
- **Brush Size Control**: Adjust brush size for different stroke widths
- **Undo/Redo Functionality**: Easily correct mistakes with undo and redo actions
- **Save/Load**: Export and import your notes as JSON files
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- React.js
- Material-UI for UI components
- Konva.js for canvas operations
- React Color for color picker
- Modern JavaScript (ES6+)

## Installation

Follow these steps to set up the project locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/note-taking-app.git
cd note-taking-app

# Install dependencies
npm install

# Start the development server
npm start
```
## Docker

```bash
# Building the image
docker build -t notes-app .

# Running the Container
docker run -d --restart unless-stopped -p 3000:3000 --name notes-app notes-app

```

The application will be available at `http://localhost:3000`.

## Usage

### Drawing Tools

- **Pen Tool**: Click the pen icon to draw on the canvas
- **Eraser**: Click the eraser icon to erase parts of your drawing
- **Color Selection**: Click the color circle to open the color picker
- **Brush Size**: Select from different brush sizes in the toolbar

### Page Management

- **Navigate Pages**: Use the number buttons below the toolbar to switch between pages
- **Add New Page**: Click the plus button in the bottom control panel to add a new page

### File Operations

- **Save**: Click the "Save" button to export your notes as a JSON file
- **Load**: Click the "Load" button to import previously saved notes

### History Operations

- **Undo**: Click the undo button to revert the last action
- **Redo**: Click the redo button to restore an undone action

## Project Structure

The project has been modularized for better code organization:

```
src/
├── components/
│   ├── ComponentsAccess.js    # Context provider for state management
│   ├── appBar/                # App bar components
│   │   ├── index.js           # Main AppBar component
│   │   ├── BrushSizeControls.js
│   │   ├── ColorPicker.js
│   │   ├── FileOperations.js
│   │   └── ToolsSelection.js
│   └── home/                  # Home components
│       ├── index.js           # Main Home component
│       ├── ControlPanel.js
│       ├── DrawingCanvas.js
│       ├── DrawingUtils.js
│       ├── HistoryOperations.js
│       ├── PageNavigation.js
│       └── useDrawing.js      # Custom hook for drawing functionality
└── App.js                     # Main application component
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the beautiful React components
- Konva.js for the powerful canvas manipulation library
- React Color for the color picker component
