package org.yan.domain.user.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.user.model.UserEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** 模型仓储接口 */
@Mapper
public interface UserRepository extends MyBatisPlusExtRepository<UserEntity> {

}