package org.yan.domain.task.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.task.model.TaskEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** 任务仓储接口 */
@Mapper
public interface TaskRepository extends MyBatisPlusExtRepository<TaskEntity> {

}