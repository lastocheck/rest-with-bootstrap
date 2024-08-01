package com.example.spring_boot_crud_mvc.config;

import com.example.spring_boot_crud_mvc.exceptions.RoleNotFoundException;
import com.example.spring_boot_crud_mvc.model.ContactInfo;
import com.example.spring_boot_crud_mvc.model.Role;
import com.example.spring_boot_crud_mvc.model.User;
import com.example.spring_boot_crud_mvc.service.RoleService;
import com.example.spring_boot_crud_mvc.service.UserService;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Stream;

@Component
public class SetupDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    private final RoleService roleService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private boolean alreadySetup = false;

    public SetupDataLoader(RoleService roleService, UserService userService, PasswordEncoder passwordEncoder) {
        this.roleService = roleService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Role createRoleIfNotFound(String roleStr) {
        try {
            Role role = roleService.findByName(roleStr);
            return role;
        } catch (RoleNotFoundException e) {
            Role newRole = new Role();
            newRole.setName(roleStr);
            roleService.save(newRole);
            return newRole;
        }
    }

    @Transactional
    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {

        if (alreadySetup) {
            return;
        }

        //create user and admin roles if they don't exist and save them
        List<Role> roles = Stream.of("ROLE_ADMIN", "ROLE_USER").map(this::createRoleIfNotFound).toList();

        User adminUser = userService.findByUsername("admin").orElseGet(() -> {
            User newAdmin = new User("admin", new ContactInfo("admin@test.com", "adminphone"));
            newAdmin.addRole(roles.get(0));
            newAdmin.setPassword(passwordEncoder.encode("12345"));
            return newAdmin;
        });

        User regularUser = userService.findByUsername("user").orElseGet(() -> {
            User newUser = new User("user", new ContactInfo("user@test.com", "userphone"));
            newUser.addRole(roles.get(1));
            newUser.setPassword(passwordEncoder.encode("12345"));
            return newUser;
        });

        userService.saveAll(List.of(adminUser, regularUser));

        alreadySetup = true;

    }

}
