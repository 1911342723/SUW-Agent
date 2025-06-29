package org.yan.application.user.assembler;

import org.springframework.beans.BeanUtils;
import org.yan.application.user.dto.UserSettingsDTO;
import org.yan.domain.user.model.UserSettingsEntity;
import org.yan.interfaces.dto.user.request.UserSettingsUpdateRequest;

/** 用户设置转换器 */
public class UserSettingsAssembler {

    /** 实体转DTO */
    public static UserSettingsDTO toDTO(UserSettingsEntity entity) {
        if (entity == null) {
            return null;
        }
        UserSettingsDTO dto = new UserSettingsDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    /** 请求转实体 */
    public static UserSettingsEntity toEntity(UserSettingsUpdateRequest request, String userId) {
        if (request == null) {
            return null;
        }
        UserSettingsEntity entity = new UserSettingsEntity();
        entity.setSettingConfig(request.getSettingConfig());
        entity.setUserId(userId);
        return entity;
    }
}