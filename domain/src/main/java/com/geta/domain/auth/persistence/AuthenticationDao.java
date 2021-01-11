package com.geta.domain.auth.persistence;

import com.geta.core.oauth.model.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuthenticationDao extends JpaRepository<UserAuth, Integer> {
    @Query("SELECT DISTINCT u FROM UserAuth u WHERE u.username = :username")
    UserAuth findByUsername(@Param("username") String username);
}
