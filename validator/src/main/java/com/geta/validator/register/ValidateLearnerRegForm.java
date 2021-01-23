package com.geta.validator.register;

import com.geta.core.auth.LearnerRegisterForm;
import com.geta.core.utils.common.Constants;
import com.geta.validator.common.Pattern;
import com.geta.validator.common.StringValidator;
import com.geta.validator.common.Error;
import com.geta.validator.common.Success;
import cyclops.companion.Semigroups;
import cyclops.control.Validated;

public class ValidateLearnerRegForm {
    private LearnerRegisterForm form;

    public ValidateLearnerRegForm(LearnerRegisterForm form) {
        this.form = form;
    }

    public Validated<Error, String> validate() {
        return validatePassword(form.getPassword(), form.getConfirmPassword())
                .combine(Semigroups.stringConcat, validateGender(form.getGender()));
    }

    private Validated<Error, String> validatePassword(String pwd, String confirmPwd) {
        if (StringValidator.isSafeNotBlank(pwd) && StringValidator.isSafeNotBlank(confirmPwd) && (pwd.equals(confirmPwd)) && (pwd.matches(Pattern.PASSWORD.value) && confirmPwd.matches(Pattern.PASSWORD.value))) {
            return Validated.valid(Success.PASSWORD.value);
        } else {
            return Validated.invalid(Error.PASSWORD);
        }
    }

    private Validated<Error, String> validateGender(String gender) {
        if (StringValidator.isSafeNotBlank(gender) && (gender.equals(Constants.MALE.value) || gender.equals(Constants.FEMALE.value) || gender.equals(Constants.LGBT.value))) {
            return Validated.valid(Success.GENDER.value);
        } else {
            return Validated.invalid(Error.GENDER);
        }
    }
}
