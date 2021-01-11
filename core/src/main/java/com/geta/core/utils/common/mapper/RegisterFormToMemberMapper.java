package com.geta.core.utils.common.mapper;

import com.geta.core.auth.RegisterForm;
import com.geta.core.member.model.Member;
import com.geta.core.utils.common.DateFormatter;
import com.geta.core.utils.common.Thailand;

// TODO This file is never use need to improve
public class RegisterFormToMemberMapper implements Mapper<RegisterForm, Member>{
    @Override
    public Member map(RegisterForm from) {
        try {
            Member member = new Member();
            member.setFirstname(from.getFirstname());
            member.setLastname(from.getLastname());
            member.setGender(from.getGender());
            member.setDoB(DateFormatter.thaiSimpleFormatter.parse(from.getDateOfBirth()));
            member.setAddress1(Thailand.FULL_ADDRESS);
            member.setAddress2(null);
            member.setEmail(from.getEmail());
            member.setUserName(from.getEmail());
            return member;
        } catch (Exception exception) {
            return null;
        }
    }
}
