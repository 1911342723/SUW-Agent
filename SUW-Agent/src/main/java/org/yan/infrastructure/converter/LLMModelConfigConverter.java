package org.yan.infrastructure.converter;

import org.apache.ibatis.type.MappedTypes;
import org.yan.domain.agent.model.LLMModelConfig;

/** LLMModelConfig JSON转换器 */
@MappedTypes(LLMModelConfig.class)
public class LLMModelConfigConverter extends JsonToStringConverter<LLMModelConfig> {

    public LLMModelConfigConverter() {
        super(LLMModelConfig.class);
    }
}