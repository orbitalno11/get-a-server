package com.geta.data.member.persistence;

import com.geta.core.member.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MemberDao extends JpaRepository<Member, Integer> {
    @Query("SELECT m FROM Member m WHERE m.username = :username")
    Member findByUsername(@Param("username") String username);
}
