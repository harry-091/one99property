export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Route not found" });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
};

