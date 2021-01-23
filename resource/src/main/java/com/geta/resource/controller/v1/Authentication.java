package com.geta.resource.controller.v1;

import com.geta.core.auth.LearnerRegisterForm;
import com.geta.core.member.model.Member;
import com.geta.core.oauth.model.UserAuth;
import com.geta.core.response.ClientResponse;
import com.geta.core.response.FailureClientResponse;
import com.geta.core.response.SuccessClientResponse;
import com.geta.domain.auth.CreateUserAuthUseCase;
import com.geta.domain.member.CreateMemberUseCase;
import com.geta.validator.common.Error;
import com.geta.validator.register.ValidateLearnerRegForm;
import cyclops.companion.Monoids;
import cyclops.control.Validated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.function.Function;

@RestController
@RequestMapping("/v1/auth")
public class Authentication {
    @Autowired
    private CreateUserAuthUseCase createUserAuthUseCase;

    @Autowired
    private CreateMemberUseCase createMemberUseCase;

    @PostMapping("/register/learner")
    public ClientResponse register(@RequestBody LearnerRegisterForm form) {
        try {
            ValidateLearnerRegForm validator = new ValidateLearnerRegForm(form);
            Validated<Error, String> isValid = validator.validate();
            if (isValid.isInvalid()) {
                String temp = isValid.bimap(Error::name, Function.identity())
                        .foldInvalidLeft(Monoids.stringJoin(","))
                        .trim();
                return new SuccessClientResponse<String>(temp, "ERROR");
            } else {
                return new SuccessClientResponse<Validated<Error, String>>(isValid, "validate result");
            }
//            UserAuth userAuth = createUserAuthUseCase.execute(form);
//            if (userAuth == null) return new FailureClientResponse(userAuth, "Can not create user");
//            Member member = createMemberUseCase.execute(form);
//            return new SuccessClientResponse<Member>(member, "success");
        } catch (Exception exception) {
            return new FailureClientResponse(exception, "Failure");
        }
    }
}
