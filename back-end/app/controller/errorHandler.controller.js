export const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    isSuccess: false,
    message: err.message || "Internal Server Error",
    callstack: err.stack || null,
    data: {},
  });
};
