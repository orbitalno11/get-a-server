package com.geta.core.auth;


public class LearnerRegisterForm extends RegisterForm {
    private int grade;

    public LearnerRegisterForm(){ }

    public LearnerRegisterForm(
            String firstname,
            String lastname,
            String gender,
            String dateOfBirth,
            int grade,
            String email,
            String password,
            String confirmPassword
    ) {
        super(firstname, lastname, gender, dateOfBirth, email, password, confirmPassword);
        this.grade = grade;
    }
}
