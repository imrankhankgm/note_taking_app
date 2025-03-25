// Functions for handling undo/redo operations

export const useHistoryOperations = (currentPage, setCurrentPage, pages, setPages, undo, setUndo, redo, setRedo) => {
  // Add new page handler
  const addNewPage = () => {
    setPages([...pages, []]);
    setCurrentPage(pages.length); // Switch to the new page
    // Clear redo when switching pages
    setRedo([]);
  };

  // Undo function
  const handleUndo = () => {
    setUndo((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;
      const lastAction = prevUndo[prevUndo.length - 1];
      // Only undo if the last action belongs to the current page
      if (lastAction.page !== currentPage) return prevUndo;

      // Depending on whether the action was a pen stroke or an eraser action, undo appropriately.
      if (lastAction.line) {
        // Undo for pen stroke: remove the last line
        setPages((prevPages) => {
          const newPages = [...prevPages];
          newPages[currentPage] = newPages[currentPage].slice(0, -1);
          return newPages;
        });
      } else if (lastAction.erased) {
        // Undo for eraser action: restore the erased strokes
        setPages((prevPages) => {
          const newPages = [...prevPages];
          newPages[currentPage] = [...newPages[currentPage], ...lastAction.erased];
          return newPages;
        });
      }
      // Push the undone action to the redo stack (limit to 10 actions)
      setRedo((prevRedo) => [...prevRedo, lastAction].slice(-10));
      return prevUndo.slice(0, -1);
    });
  };

  // Redo function
  const handleRedo = () => {
    setRedo((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const lastAction = prevRedo[prevRedo.length - 1];
      if (lastAction.page !== currentPage) return prevRedo;
      const newRedo = prevRedo.slice(0, -1);
      // Reapply the undone action.
      if (lastAction.line) {
        setPages((prevPages) => {
          const newPages = [...prevPages];
          newPages[currentPage] = [...newPages[currentPage], lastAction.line];
          return newPages;
        });
      } else if (lastAction.erased) {
        setPages((prevPages) => {
          const newPages = [...prevPages];
          // Remove strokes matching those in lastAction.erased.
          newPages[currentPage] = newPages[currentPage].filter(
            (stroke) =>
              !lastAction.erased.some(
                (erasedStroke) => erasedStroke === stroke
              )
          );
          return newPages;
        });
      }
      // Push the action back to the undo stack (limit to 10 actions)
      setUndo((prevUndo) => [...prevUndo, lastAction].slice(-10));
      return newRedo;
    });
  };

  return {
    addNewPage,
    handleUndo,
    handleRedo
  };
}; 