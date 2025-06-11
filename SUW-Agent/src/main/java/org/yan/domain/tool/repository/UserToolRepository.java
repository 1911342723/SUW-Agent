package org.yan.domain.tool.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.tool.model.UserToolEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

@Mapper
public interface UserToolRepository extends MyBatisPlusExtRepository<UserToolEntity> {
}
