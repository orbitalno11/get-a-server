package com.geta.core.utils;

public interface UseCase<IN, OUT> {
    OUT execute(IN input);
}
