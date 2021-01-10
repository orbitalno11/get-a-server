package com.geta.domain.member;

import com.geta.core.auth.RegisterForm;
import com.geta.core.member.model.Member;

public interface MemberRepository {
    Member createMember(RegisterForm form);
}
