package com.geta.domain.auth;

import com.geta.core.oauth.model.UserAuth;
import com.geta.core.utils.CustomPasswordEncoder;
import com.geta.domain.common.CustomRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public class UserRepositoryImpl extends CustomRepository implements UserAuthRepository {

    @Override
    @Transactional
    public void createUserAuth(UserAuth userAuth) {
        super.entityManager.createNativeQuery("INSERT INTO user_auth (account_expired, account_locked, credentials_expired, enabled, password, username) VALUES (0,0,0,1,?,?)")
                .setParameter(1, CustomPasswordEncoder.createBCryptEncoder().encode(userAuth.getPassword()))
                .setParameter(2, userAuth.getUserName())
                .executeUpdate();
    }
}
