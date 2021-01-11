package com.geta.core.utils.common.mapper;

import com.geta.core.auth.RegisterForm;
import com.geta.core.oauth.model.UserAuth;

public class RegisterFormToUserAuthMapper implements Mapper<RegisterForm, UserAuth>{
    @Override
    public UserAuth map(RegisterForm from) {
        UserAuth user = new UserAuth();
        user.setUserName(from.getEmail());
        user.setPassword(from.getPassword());
        user.setAccountExpired(false);
        user.setAccountLocked(false);
        user.setCredentialsExpired(false);
        user.setEnabled(true);
        return user;
    }
}
