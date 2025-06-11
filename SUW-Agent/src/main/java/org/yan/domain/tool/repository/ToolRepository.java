package org.yan.domain.tool.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.tool.model.ToolEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** 工具仓储接口 */
@Mapper
public interface ToolRepository extends MyBatisPlusExtRepository<ToolEntity> {
}