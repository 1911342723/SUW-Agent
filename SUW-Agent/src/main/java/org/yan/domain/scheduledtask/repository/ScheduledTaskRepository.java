package org.yan.domain.scheduledtask.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.scheduledtask.model.ScheduledTaskEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** 定时任务仓储接口 */
@Mapper
public interface ScheduledTaskRepository extends MyBatisPlusExtRepository<ScheduledTaskEntity> {
}