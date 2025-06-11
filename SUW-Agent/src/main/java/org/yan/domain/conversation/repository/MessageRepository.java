package org.yan.domain.conversation.repository;

import org.apache.ibatis.annotations.Mapper;
import org.yan.domain.conversation.model.MessageEntity;
import org.yan.infrastructure.repository.MyBatisPlusExtRepository;

/** 消息仓库接口 */
@Mapper
public interface MessageRepository extends MyBatisPlusExtRepository<MessageEntity> {
}