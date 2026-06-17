package com.conectarsj.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta con token JWT")
public class JwtResponse {

    @Schema(description = "Token JWT de autenticación", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;

    public JwtResponse(String token) { this.token = token; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}