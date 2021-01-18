package com.geta.data.auth;

import com.geta.core.oauth.model.UserAuth;
import com.geta.core.oauth.value.Authority;
import com.geta.data.common.CustomRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public class UserAuthorityRepositoryImpl extends CustomRepository implements UserAuthorityRepository{
    @Override
    @Transactional
    public void createUserAuthority(UserAuth userAuth) {
        super.entityManager.createNativeQuery("INSERT INTO user_authority (authority_id, user_id) VALUES (?,?)")
                .setParameter(1, Authority.USER_ID)
                .setParameter(2, userAuth.getId())
                .executeUpdate();
    }
}
