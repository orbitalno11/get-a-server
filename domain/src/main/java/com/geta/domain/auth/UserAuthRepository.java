package com.geta.domain.auth;

import com.geta.core.oauth.model.UserAuth;

public interface UserAuthRepository {
    void createUserAuth(UserAuth userAuth);
}
