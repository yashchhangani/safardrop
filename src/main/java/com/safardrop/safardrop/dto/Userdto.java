package com.safardrop.safardrop.dto;

public class Userdto {
    private int user_id;
    private String user_name;
    private String email;
    private String password;
    private String phone_no;
    private String role;

    public Userdto() {}

    public Userdto(int user_id, String user_name, String email, String password, String phone_no, String role) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.email = email;
        this.password = password;
        this.phone_no = phone_no;
        this.role = role;
    }

    public int getUser_id() { return user_id; }
    public void setUser_id(int user_id) { this.user_id = user_id; }

    public String getUser_name() { return user_name; }
    public void setUser_name(String user_name) { this.user_name = user_name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone_no() { return phone_no; }
    public void setPhone_no(String phone_no) { this.phone_no = phone_no; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
