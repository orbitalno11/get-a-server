package com.geta.validator.common;

public enum Error {
    // learner register form
    EMAIL("e-mail is invalid"),
    PHONE_NUMBER("phone number is invalid"),
    NATION_ID_TH("nation id is valid"),
    PASSWORD("password is invalid"),
    GENDER("gender is invalid");

    public final String value;
    private Error(String value) {
        this.value = value;
    }
}
