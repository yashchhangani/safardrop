package com.safardrop.safardrop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int user_id;

    @NotBlank(message = "Username is required")
    private String user_name;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits")
    private String phone_no;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    // Getters and Setters
    public int getUser_id() { return user_id; }
    public void setUser_id(int user_id) { this.user_id = user_id; }

    public String getUser_name() { return user_name; }
    public void setUser_name(String user_name) { this.user_name = user_name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone_no() { return phone_no; }
    public void setPhone_no(String phone_no) { this.phone_no = phone_no; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}