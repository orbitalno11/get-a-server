package com.geta.core.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class CustomPasswordEncoder {
    public static PasswordEncoder createBCryptEncoder() {
        return new BCryptPasswordEncoder(4);
    }
}
