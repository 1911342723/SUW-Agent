package org.yan.infrastructure.llm.protocol.enums;

import org.yan.infrastructure.exception.BusinessException;

public enum ProviderProtocol {

    OpenAI, ANTHROPIC;

    public static ProviderProtocol fromCode(String code) {
        for (ProviderProtocol protocol : values()) {
            if (protocol.name().equals(code)) {
                return protocol;
            }
        }
        throw new BusinessException("Unknown model type code: " + code);
    }
}
