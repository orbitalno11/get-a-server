package com.geta.core.utils.common.mapper;

public interface Mapper <IN, OUT>{
    OUT map(IN from);
}
