package com.geta.core.member.model;

import com.geta.core.subject.model.InterestedSubject;

import javax.persistence.*;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="member", uniqueConstraints = @UniqueConstraint(columnNames = {"email", "username"}, name="MEMBER_UNIQUE_KEY"))
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", columnDefinition = "bigint unsigned")
    private Integer id;

    @Column
    private String firstname;

    @Column
    private String lastname;

    @Column
    private String gender;

    @Column
    private Date DoB;

    @Column
    private String address1;

    @Column
    private String address2;

    @Column
    private String email;

    @Column
    private String username;

    @Column
    private Date created;

    @Column
    private Date updated;

    @OneToMany(mappedBy = "member", targetEntity = InterestedSubject.class, cascade = {CascadeType.ALL}, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<InterestedSubject> interestedSubjects = new HashSet<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Date getDoB() {
        return DoB;
    }

    public void setDoB(Date doB) {
        DoB = doB;
    }

    public String getAddress1() {
        return address1;
    }

    public void setAddress1(String address1) {
        this.address1 = address1;
    }

    public String getAddress2() {
        return address2;
    }

    public void setAddress2(String address2) {
        this.address2 = address2;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserName() {
        return username;
    }

    public void setUserName(String userName) {
        this.username = userName;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }
}
