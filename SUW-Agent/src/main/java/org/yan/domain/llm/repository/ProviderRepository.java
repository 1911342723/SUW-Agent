package org.yan.domain.llm.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.llm.model.ProviderEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** 服务提供商仓储接口 */
@Mapper
public interface ProviderRepository extends MyBatisPlusExtRepository<ProviderEntity> {

}