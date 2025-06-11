package org.yan.domain.agent.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.agent.model.AgentEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** Agent仓库接口 */
@Mapper
public interface AgentRepository extends MyBatisPlusExtRepository<AgentEntity> {
}