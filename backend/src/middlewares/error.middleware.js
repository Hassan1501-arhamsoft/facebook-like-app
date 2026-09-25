import { errorResponse } from "../utils/response.js";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  return errorResponse(
    res,
    err.message || "Internal Server Error",
    err.statusCode || 500
  );
};

export default errorMiddleware;