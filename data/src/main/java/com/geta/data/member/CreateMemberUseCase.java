package com.geta.data.member;

import com.geta.core.auth.RegisterForm;
import com.geta.core.member.model.Member;
import com.geta.core.utils.UseCase;
import com.geta.domain.member.MemberRepository;
import com.geta.domain.member.persistence.MemberDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CreateMemberUseCase implements UseCase<RegisterForm, Member> {
    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MemberDao memberDao;

    @Override
    public Member execute(RegisterForm input) {
        try {
            this.memberRepository.createMember(input);
            Member member = memberDao.findByUsername(input.getEmail());
            return member;
        } catch (Exception exception) {
            return null;
        }
    }
}
