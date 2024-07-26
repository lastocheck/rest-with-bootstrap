package com.example.spring_boot_crud_mvc.rest;

import com.example.spring_boot_crud_mvc.dto.UserDTO;
import com.example.spring_boot_crud_mvc.mapper.UserMapper;
import com.example.spring_boot_crud_mvc.model.Role;
import com.example.spring_boot_crud_mvc.model.User;
import com.example.spring_boot_crud_mvc.service.RoleService;
import com.example.spring_boot_crud_mvc.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
public class UsersRestController {

    private final UserService userService;

    private final RoleService roleService;

    private final PasswordEncoder passwordEncoder;

    public UsersRestController(UserService userService, PasswordEncoder passwordEncoder, RoleService roleService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers().stream().map(UserMapper::toDTO).toList();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable int id) {
        return userService.findById(id);
    }

    @PostMapping
    public User addUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.save(user);
        return user;
    }

    @PutMapping
    public UserDTO editUser(@RequestBody UserDTO userDTO) {
        User user = UserMapper.toEntity(userDTO);
        if (userDTO.getPassword().isEmpty()) {
            User oldUser = userService.findById(userDTO.getId());
            user.setPassword(oldUser.getPassword());
        } else {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        Set<Role> roles = userDTO.getRoles().stream().map(roleStr -> roleService.findByName("ROLE_" + roleStr)).collect(Collectors.toSet());
        user.setRoles(roles);

        userService.update(user);
        return UserMapper.toDTO(user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.delete(id);
        return "Successfully deleted user with id " + id;
    }
}
