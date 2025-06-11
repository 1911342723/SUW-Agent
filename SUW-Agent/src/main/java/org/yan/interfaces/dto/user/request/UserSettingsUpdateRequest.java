package org.yan.interfaces.dto.user.request;

import org.yan.domain.user.model.config.UserSettingsConfig;

/** 用户设置更新请求 */
public class UserSettingsUpdateRequest {

    private UserSettingsConfig settingConfig;

    public UserSettingsConfig getSettingConfig() {
        return settingConfig;
    }

    public void setSettingConfig(UserSettingsConfig settingConfig) {
        this.settingConfig = settingConfig;
    }
}