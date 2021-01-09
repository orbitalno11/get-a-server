package com.devgeta.auth.persistence;

import com.devgeta.core.model.UserAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserAuthDao extends JpaRepository<UserAuth, Integer> {
    @Query("SELECT DISTINCT u FROM UserAuth u WHERE u.userName = :username")
    UserAuth findByUsername(@Param("username") String username);
}
