package com.safardrop.safardrop.dto;

public class UserDTO {

    private int user_id;
    private String user_name;
    private String email;
    private String phone_no;

    // Constructor
    public UserDTO(int user_id, String user_name, String email, String phone_no) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.email = email;
        this.phone_no = phone_no;
    }

    // Getters
    public int getUser_id() {
        return user_id;
    }

    public String getUser_name() {
        return user_name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone_no() {
        return phone_no;
    }
}