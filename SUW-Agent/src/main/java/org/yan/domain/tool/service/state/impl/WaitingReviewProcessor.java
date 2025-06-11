package org.yan.domain.tool.service.state.impl;

import org.yan.domain.tool.constant.ToolStatus;
import org.yan.domain.tool.model.ToolEntity;
import org.yan.domain.tool.service.state.ToolStateProcessor;

/** 等待审核状态处理器 */
public class WaitingReviewProcessor implements ToolStateProcessor {

    @Override
    public ToolStatus getStatus() {
        return ToolStatus.WAITING_REVIEW;
    }

    @Override
    public void process(ToolEntity tool) {
        // 等待审核状态不需要处理，直接通过进入下一步
    }

    @Override
    public ToolStatus getNextStatus() {
        return ToolStatus.GITHUB_URL_VALIDATE;
    }
}