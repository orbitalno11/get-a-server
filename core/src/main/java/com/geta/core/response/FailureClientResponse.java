package com.geta.core.response;

public class FailureClientResponse<C> extends ClientResponse<C> {
    public FailureClientResponse(C data, String message) {
        super(data, message, false);
    }
}
