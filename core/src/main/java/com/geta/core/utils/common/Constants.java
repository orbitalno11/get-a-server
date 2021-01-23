package com.geta.core.utils.common;

public enum Constants {
    // register form
    // gender
    MALE("male"),
    FEMALE("female"),
    LGBT("lgbt");

    public final String value;
    private Constants(String value) {
        this.value = value;
    }
}
