package com.geta.core.subject.model;

import com.geta.core.member.model.Member;

import javax.persistence.*;

@Entity
@Table(name = "interested_subject")
public class InterestedSubject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", columnDefinition = "bigint unsigned")
    private Integer id;

    @Column
    private Integer rank;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "MEMBER_ID", foreignKey = @ForeignKey(name = "FK_MEMBER_INTERESTED_SUBJECT"))
    private Member member;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "SUBJECT_ID", foreignKey = @ForeignKey(name = "FK_SUBJECT_INTERESTED_SUBJECT"))
    private Subject subject;
}
