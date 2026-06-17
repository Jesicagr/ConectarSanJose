package com.conectarsj.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Solicitud de registro de administrador")
public class RegisterUserRequest {

    @Schema(description = "Email del nuevo administrador", example = "nuevo@ejemplo.com")
    private String email;

    @Schema(description = "Contraseña (mínimo 6 caracteres)", example = "password123")
    private String password;

    @Schema(description = "Rol del usuario (ADMIN o SUPER_ADMIN)", example = "ADMIN", allowableValues = {"ADMIN", "SUPER_ADMIN"})
    private String rol;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}
