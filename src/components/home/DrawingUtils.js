// Helper utilities for drawing operations

// Compute bounding box from a set of points
export const computeBoundingBox = (points) => {
  const xs = points.filter((_, i) => i % 2 === 0);
  const ys = points.filter((_, i) => i % 2 === 1);
  return {
    x1: Math.min(...xs),
    y1: Math.min(...ys),
    x2: Math.max(...xs),
    y2: Math.max(...ys),
  };
};

// Check if two boxes intersect
export const boxesIntersect = (box1, box2) => {
  return (
    box1.x1 < box2.x2 &&
    box1.x2 > box2.x1 &&
    box1.y1 < box2.y2 &&
    box1.y2 > box2.y1
  );
}; 