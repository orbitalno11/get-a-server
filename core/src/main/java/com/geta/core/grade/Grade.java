package com.geta.core.grade;

import javax.persistence.*;

@Entity
@Table(name = "grade", uniqueConstraints = @UniqueConstraint(name = "GRADE_UNIQUE_KEY", columnNames = {"name", "gradeValue"}))
public class Grade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID", columnDefinition = "bigint unsigned")
    private Integer id;

    @Column
    private String name;

    @Column
    private Integer gradeValue;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getGradeValue() {
        return gradeValue;
    }

    public void setGradeValue(Integer gradeValue) {
        this.gradeValue = gradeValue;
    }
}
