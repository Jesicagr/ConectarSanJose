package com.conectarsj.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Solicitud de inicio de sesión")
public class LoginRequest {

    @Schema(description = "Email del administrador", example = "admin@ejemplo.com")
    private String email;

    @Schema(description = "Contraseña del administrador", example = "miPassword123")
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}