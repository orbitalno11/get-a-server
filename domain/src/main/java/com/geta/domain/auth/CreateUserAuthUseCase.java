package com.geta.domain.auth;

import com.geta.core.auth.RegisterForm;
import com.geta.core.oauth.model.UserAuth;
import com.geta.core.utils.UseCase;
import com.geta.core.utils.common.mapper.RegisterFormToUserAuthMapper;
import com.geta.data.auth.UserAuthRepository;
import com.geta.data.auth.UserAuthorityRepository;
import com.geta.data.auth.persistence.AuthenticationDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Component
public class CreateUserAuthUseCase extends UseCase<RegisterForm, UserAuth> {
    @Autowired
    private UserAuthRepository userAuthRepository;

    @Autowired
    private UserAuthorityRepository userAuthorityRepository;

    @Autowired
    private AuthenticationDao authenticationDao;

    @Override
    @Transactional
    public UserAuth execute(RegisterForm input) {
        try {
            RegisterFormToUserAuthMapper mapper = new RegisterFormToUserAuthMapper();
            UserAuth user = mapper.map(input);
            this.userAuthRepository.createUserAuth(user);
            UserAuth userAuth = authenticationDao.findByUsername(user.getUserName());
            this.userAuthorityRepository.createUserAuthority(userAuth);
            return user;
        } catch (Exception exception) {
            return null;
        }
    }
}
