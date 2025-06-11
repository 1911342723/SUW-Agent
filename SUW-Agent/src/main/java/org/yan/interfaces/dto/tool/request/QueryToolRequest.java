package org.yan.interfaces.dto.tool.request;

import org.yan.interfaces.dto.Page;

public class QueryToolRequest extends Page {

    private String toolName;

    public String getToolName() {
        return toolName;
    }

    public void setToolName(String toolName) {
        this.toolName = toolName;
    }
}
