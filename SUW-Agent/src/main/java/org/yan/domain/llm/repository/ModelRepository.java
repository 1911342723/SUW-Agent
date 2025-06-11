package org.yan.domain.llm.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.llm.model.ModelEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** 模型仓储接口 */
@Mapper
public interface ModelRepository extends MyBatisPlusExtRepository<ModelEntity> {

}