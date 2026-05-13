package com.example.proyecto1programacion4.presentation.api.dto;

public class LoginResponse {

    private String token;
    private String tipo;
    private String email;

    public LoginResponse(String token, String tipo, String email) {
        this.token = token;
        this.tipo = tipo;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getTipo() {
        return tipo;
    }

    public String getEmail() {
        return email;
    }
}
