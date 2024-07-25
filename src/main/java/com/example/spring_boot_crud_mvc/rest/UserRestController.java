package com.example.spring_boot_crud_mvc.rest;

import com.example.spring_boot_crud_mvc.model.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserRestController {

    @GetMapping("/api/v1/user")
    public User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        var user = (User) auth.getPrincipal();
        return user;
    }

}
