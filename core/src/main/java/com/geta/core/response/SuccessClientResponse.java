package com.geta.core.response;

public class SuccessClientResponse<C> extends ClientResponse<C>{
    public SuccessClientResponse(C data, String message) {
        super(data, message, true);
    }
}
