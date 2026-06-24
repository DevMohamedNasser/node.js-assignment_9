export const SuccessResponse = ({res, statusCode = 200, message = "done", data = {}}) => {
    return res.status(statusCode).json({message, data})
}