package com.geta.core.response;

abstract public class ClientResponse<T> {
    private String message;
    private Boolean isSuccess;
    private T data;

    public ClientResponse(T data, String message, Boolean success) {
        this.data = data;
        this.message = message;
        this.isSuccess = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Boolean IsSuccess() {
        return isSuccess;
    }

    public void setIsSuccess(Boolean isSuccess) {
        this.isSuccess = isSuccess;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
