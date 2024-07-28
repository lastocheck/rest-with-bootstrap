package com.example.spring_boot_crud_mvc.model;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Email;

@Embeddable
public class ContactInfo {

    @Email
    private String email;
    private String phone;

    public ContactInfo() {}

    public ContactInfo(String email, String phone) {
        this.email = email;
        this.phone = phone;
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

    @Override
    public String toString() {
        return "ContactInfo{" +
               "email='" + email + '\'' +
               ", phone='" + phone + '\'' +
               '}';
    }
}
