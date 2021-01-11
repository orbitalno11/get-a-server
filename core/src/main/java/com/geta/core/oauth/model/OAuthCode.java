package com.geta.core.oauth.model;

import javax.persistence.*;

@Entity
@Table(name="oauth_code")
public class OAuthCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", columnDefinition = "bigint unsigned")
    private Integer id;

    @Column(name="code")
    private String code;

    @Lob
    @Column(name="authentication", columnDefinition = "mediumblob")
    private byte[] authentication;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public byte[] getAuthentication() {
        return authentication;
    }

    public void setAuthentication(byte[] authentication) {
        this.authentication = authentication;
    }

}
