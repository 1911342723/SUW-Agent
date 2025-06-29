package org.yan.application.user.assembler;

import org.springframework.beans.BeanUtils;
import org.yan.application.user.dto.UserDTO;
import org.yan.domain.user.model.UserEntity;
import org.yan.interfaces.dto.user.request.RegisterRequest;
import org.yan.interfaces.dto.user.request.UserUpdateRequest;

public class UserAssembler {

    public static UserDTO toDTO(UserEntity userEntity) {
        UserDTO userDTO = new UserDTO();

        BeanUtils.copyProperties(userEntity, userDTO);
        return userDTO;
    }

    public static UserEntity toEntity(UserDTO userDTO) {
        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(userDTO, userEntity);
        return userEntity;
    }

    public static UserEntity toEntity(RegisterRequest registerRequest) {
        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(registerRequest, userEntity);
        return userEntity;
    }

    public static UserEntity toEntity(UserUpdateRequest userUpdateRequest, String userId) {
        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(userUpdateRequest, userEntity);
        userEntity.setId(userId);
        return userEntity;
    }
}
