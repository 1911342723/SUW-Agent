package org.yan.application.agent.assembler;

import org.springframework.beans.BeanUtils;
import org.yan.domain.agent.model.LLMModelConfig;
import org.yan.interfaces.dto.agent.request.UpdateModelConfigRequest;

/** Agent领域对象组装器 负责DTO、Entity和Request之间的转换 */
public class AgentWorkspaceAssembler {

    public static LLMModelConfig toLLMModelConfig(UpdateModelConfigRequest request) {

        LLMModelConfig llmModelConfig = new LLMModelConfig();
        BeanUtils.copyProperties(request, llmModelConfig);
        return llmModelConfig;
    }

}