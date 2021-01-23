package com.geta.core.utils;

public abstract class UseCase<IN, OUT> {
    protected abstract OUT execute(IN input);
}
