package com.example.spring_boot_crud_mvc.mapper;

import com.example.spring_boot_crud_mvc.dto.UserDTO;
import com.example.spring_boot_crud_mvc.model.ContactInfo;
import com.example.spring_boot_crud_mvc.model.Role;
import com.example.spring_boot_crud_mvc.model.User;
import com.example.spring_boot_crud_mvc.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    public UserMapper(PasswordEncoder passwordEncoder, RoleService roleService) {
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }

    public UserDTO toDTO(User user) {
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getContactInfo().getEmail(),
                user.getContactInfo().getPhone(),
                user.getRoles().stream().map(role -> role.getName().substring(5)).collect(Collectors.toSet()));
    }

    public User toEntity(UserDTO dto) {
        User user = new User(
                dto.getUsername(),
                new ContactInfo(dto.getEmail(), dto.getPhone())
        );
        if (dto.getId() != null) {
            user.setId(dto.getId());
        }

        if (dto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        if (dto.getRoles() != null) {
            Set<Role> roles = dto.getRoles().stream().map(roleStr -> roleService.findByName("ROLE_" + roleStr)).collect(Collectors.toSet());
            user.setRoles(roles);
        }
        return user;
    }
}
