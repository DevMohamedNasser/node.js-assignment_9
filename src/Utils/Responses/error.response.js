export const ErrorResponse = ({
  message = "Error",
  statusCode = 400,
  extra = undefined,
}) => {
  const error = new Error(
    typeof message == "string" ? message : message.message,
  );
  error.status = statusCode;
  error.extra = extra;

  throw error;
};

export const BadRequestException = (
  message = "BadRequestException",
  extra = undefined,
) => {
  ErrorResponse({ message, statusCode: 400, extra });
};

export const UnauthorizedException = (
  message = "UnauthorizedException",
  extra = undefined,
) => {
  ErrorResponse({ message, statusCode: 401, extra });
};

export const ForbiddenException = (
  message = "ForbiddenException",
  extra = undefined,
) => {
  ErrorResponse({ message, statusCode: 403, extra });
};

export const NotFoundException = (
  message = "NotFoundException",
  extra = undefined,
) => {
  ErrorResponse({ message, statusCode: 404, extra });
};

export const ConflictException = (
  message = "ConflictException",
  extra = undefined,
) => {
  ErrorResponse({ message, statusCode: 409, extra });
};

export const ServerErrorException = (
    extra = undefined
) => {
    ErrorResponse({message: "Internal server error", statusCode: 500, extra})
}

export const GlobalErrorHandler = (err, req, res, next) => {
  const status = err.status ?? 500;

  return res
    .status(status)
    .json({ message: err.message, stack: err.stack, status });
};
