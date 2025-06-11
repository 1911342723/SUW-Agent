package org.yan.domain.tool.service.state;

import org.yan.domain.tool.constant.ToolStatus;
import org.yan.domain.tool.model.ToolEntity;

/** 工具状态处理器接口 */
public interface ToolStateProcessor {
    /** 获取处理器对应的状态 */
    ToolStatus getStatus();

    /** 处理工具状态 */
    void process(ToolEntity tool);

    /** 获取下一个状态 */
    ToolStatus getNextStatus();
}