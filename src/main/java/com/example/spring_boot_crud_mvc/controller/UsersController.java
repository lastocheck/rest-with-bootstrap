package com.example.spring_boot_crud_mvc.controller;

import com.example.spring_boot_crud_mvc.model.User;
import com.example.spring_boot_crud_mvc.service.RoleService;
import com.example.spring_boot_crud_mvc.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UsersController {

    private final UserService userService;

    private final RoleService roleService;

    private final PasswordEncoder passwordEncoder;

    public UsersController(UserService userService, PasswordEncoder passwordEncoder, RoleService roleService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.roleService = roleService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
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
    public User editUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userService.update(user);
        return user;
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.delete(id);
        return "Successfully deleted user with id " + id;
    }
}
