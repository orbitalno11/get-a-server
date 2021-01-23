package com.geta.validator.common;

public enum Success {
    NAME("name ok"),
    EMAIL("e-mail ok"),
    PHONE_NUMBER("phone number is ok"),
    NATION_ID_TH("nation id is ok"),
    PASSWORD("password is ok");

    public final String value;
    private Success(String value){
        this.value = value;
    }
}
