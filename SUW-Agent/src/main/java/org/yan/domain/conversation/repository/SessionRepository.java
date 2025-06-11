package org.yan.domain.conversation.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.conversation.model.SessionEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** 会话仓库接口 */
@Mapper
public interface SessionRepository extends MyBatisPlusExtRepository<SessionEntity> {
}