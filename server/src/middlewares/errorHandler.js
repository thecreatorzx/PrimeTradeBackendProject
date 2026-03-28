const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";
  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
