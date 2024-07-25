package com.example.spring_boot_crud_mvc.dto;

import java.util.Set;

public class UserDTO {
    private Integer id;
    private String username;
    private String email;
    private String phone;
    private Set<String> roles;

    public UserDTO(Integer id, String username, String email, String phone, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.roles = roles;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
