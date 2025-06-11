package org.yan.application.conversation.service.message.chat;

import org.springframework.stereotype.Component;
import org.yan.application.conversation.service.message.AbstractMessageHandler;
import org.yan.domain.conversation.service.MessageDomainService;
import org.yan.infrastructure.llm.LLMServiceFactory;

/** 标准消息处理器 */
@Component(value = "chatMessageHandler")
public class ChatMessageHandler extends AbstractMessageHandler {

    public ChatMessageHandler(LLMServiceFactory llmServiceFactory, MessageDomainService messageDomainService) {
        super(llmServiceFactory, messageDomainService);
    }
}