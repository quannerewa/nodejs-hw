import { isCelebrateError } from "celebrate";
import { HttpError } from "http-errors";

export const errorHandler = (err, req, res, next) => {
  console.error("Error Middleware:", err);

  if (isCelebrateError(err)) {
    const segment = ["body", "query", "params", "headers"]
      .map(k => err.details.get(k))
      .find(v => v);

    return res.status(400).json({
      message: segment.message,
      details: segment.details,
    });
  }


  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message || err.name,
    });
  }

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd
      ? "Something went wrong. Please try again later."
      : err.message,
  });
};
