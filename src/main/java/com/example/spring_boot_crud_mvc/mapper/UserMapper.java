package com.example.spring_boot_crud_mvc.mapper;

import com.example.spring_boot_crud_mvc.dto.UserDTO;
import com.example.spring_boot_crud_mvc.model.ContactInfo;
import com.example.spring_boot_crud_mvc.model.User;

import java.util.stream.Collectors;

public class UserMapper {

    public static UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getContactInfo().getEmail(),
                user.getContactInfo().getPhone(),
                user.getRoles().stream().map(role -> role.getName().substring(5)).collect(Collectors.toSet()));
    }

    public static User toEntity(UserDTO dto) {
        User user = new User(
                dto.getUsername(),
                new ContactInfo(dto.getEmail(), dto.getPhone())
        );
        if (dto.getId() != null) {
            user.setId(dto.getId());
        }
        return user;
    }
}
