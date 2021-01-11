package com.geta.domain.auth;

import com.geta.core.oauth.model.UserAuth;

public interface UserAuthorityRepository {
    void createUserAuthority(UserAuth userAuth);
}
