package org.yan.domain.conversation.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.conversation.model.ContextEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** 上下文仓库接口 */
@Mapper
public interface ContextRepository extends MyBatisPlusExtRepository<ContextEntity> {
}