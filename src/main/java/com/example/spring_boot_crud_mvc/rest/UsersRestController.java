package com.example.spring_boot_crud_mvc.rest;

import com.example.spring_boot_crud_mvc.dto.UserDTO;
import com.example.spring_boot_crud_mvc.mapper.UserMapper;
import com.example.spring_boot_crud_mvc.model.User;
import com.example.spring_boot_crud_mvc.service.RoleService;
import com.example.spring_boot_crud_mvc.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UsersRestController {

    private final UserService userService;

    private final RoleService roleService;

    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    public UsersRestController(UserService userService, PasswordEncoder passwordEncoder, RoleService roleService, UserMapper userMapper) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
        this.userMapper = userMapper;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers().stream().map(userMapper::toDTO).toList();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable int id) {
        return userService.findById(id);
    }

    @PostMapping
    public UserDTO addUser(@RequestBody UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);
        userService.save(user);
        return userMapper.toDTO(userService.findById(user.getId()));
    }

    @PutMapping
    public UserDTO editUser(@RequestBody UserDTO userDTO) {
        User user = userMapper.toEntity(userDTO);
        if (userDTO.getPassword().isEmpty()) {
            User oldUser = userService.findById(userDTO.getId());
            user.setPassword(oldUser.getPassword());
        }

        userService.update(user);
        return userMapper.toDTO(user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.delete(id);
        return "Successfully deleted user with id " + id;
    }
}
