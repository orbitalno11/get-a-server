package com.geta.validator.common;

public enum Pattern {
    // learner register form
    EMAIL("^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$"),
    PHONE_NUMBER("^[0-9]{9,10}$"),
    NATION_ID_TH("^[0-9]{13}$"),
    PASSWORD("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");

    public final String value;

    private Pattern(String value) {
        this.value = value;
    }
}
