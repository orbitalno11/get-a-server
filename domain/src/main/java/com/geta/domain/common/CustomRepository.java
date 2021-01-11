package com.geta.domain.common;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public abstract class CustomRepository {
    @PersistenceContext
    protected EntityManager entityManager;
}
