package com.example.spring_boot_crud_mvc.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/admin")
    public String getUsers() { return "admin/users"; }

    @GetMapping("/user")
    public String getUserPage() {
        return "user";
    }

    @GetMapping("/login")
    String login() {
        return "login";
    }

}
