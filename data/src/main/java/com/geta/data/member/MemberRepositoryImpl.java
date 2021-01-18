package com.geta.data.member;

import com.geta.core.auth.RegisterForm;
import com.geta.core.member.model.Member;
import com.geta.core.utils.common.DateFormatter;
import com.geta.core.utils.common.Thailand;
import com.geta.data.common.CustomRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.sql.Timestamp;
import java.util.Date;

@Repository
public class MemberRepositoryImpl extends CustomRepository implements MemberRepository {
    @Override
    @Transactional
    public Member createMember(RegisterForm form) {
        try {
            super.entityManager
                    .createNativeQuery("INSERT INTO member (firstname, lastname, gender, DoB, address1, address2, email, username, created, updated) VALUES (?,?,?,?,?,?,?,?,?,?)")
                    .setParameter(1, form.getFirstname())
                    .setParameter(2, form.getLastname())
                    .setParameter(3, form.getGender())
                    .setParameter(4, DateFormatter.thaiSimpleFormatter.parse(form.getDateOfBirth()))
                    .setParameter(5, Thailand.FULL_ADDRESS)
                    .setParameter(6, null)
                    .setParameter(7, form.getEmail())
                    .setParameter(8, form.getEmail())
                    .setParameter(9, new Timestamp(new Date().getTime()))
                    .setParameter(10, new Timestamp(new Date().getTime()))
                    .executeUpdate();
            return null;
        } catch (Exception exception) {
            return null;
        }
    }
}
