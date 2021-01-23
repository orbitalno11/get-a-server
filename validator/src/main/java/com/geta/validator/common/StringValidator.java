package com.geta.validator.common;

import cyclops.control.Validated;

public class StringValidator {
    public static Validated<Error, String> isValidEmail(String email) {
        if (isSafeNotBlank(email) && email.matches(Pattern.EMAIL.value)) {
            return Validated.valid(Success.EMAIL.value);
        } else {
            return Validated.invalid(Error.EMAIL);
        }
    }

    public static Validated<Error, String> isValidPhoneNumber(String phone) {
        if (isSafeNotBlank(phone) && (phone.length() >=9 && phone.length() <=10) && phone.matches(Pattern.PHONE_NUMBER.value)) {
            return Validated.valid(Success.PHONE_NUMBER.value);
        } else {
            return Validated.invalid(Error.PHONE_NUMBER);
        }
    }

    public static boolean isSafeNotBlank(String value) {
        return isNotNull(value) && isNotBlank(value);
    }

    public static boolean isNotNull(String value) {
        return value != null;
    }

    public static boolean isNotBlank(String value) {
        return !value.equals("");
    }
}
