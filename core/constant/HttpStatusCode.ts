enum HttpStatusCode {
    HTTP_200_OK = 200,
    HTTP_201_CREATED = 201,
    HTTP_400_BAD_REQUEST = 400, // The server could not understand the request due to invalid syntax.
    HTTP_401_UNAUTHORIZED = 401,
    HTTP_403_FORBIDDEN = 403, // The client does not have access rights to the content
    HTTP_404_NOT_FOUND = 404, // The server can not find the requested resource
    HTTP_500_INTERNAL_SERVER_ERROR = 500, // The server has encountered a situation it doesn't know how to handle.
}

export default HttpStatusCode