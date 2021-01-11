package com.geta.core.oauth.model.dto;

import org.springframework.security.core.GrantedAuthority;

import java.io.Serializable;

public class CustomGrantedAuthority implements GrantedAuthority, Serializable {
    private String name;

    public CustomGrantedAuthority(String name) {
        this.name = name;
    }

    @Override
    public String getAuthority() {
        return this.name;
    }
}
