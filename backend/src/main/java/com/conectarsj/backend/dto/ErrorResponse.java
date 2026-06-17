package com.conectarsj.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Respuesta estándar de error devuelta por la API")
public class ErrorResponse {

    @Schema(description = "Código de estado HTTP", example = "400")
    private int status;

    @Schema(description = "Mensaje descriptivo del error", example = "El email es requerido")
    private String error;

    public ErrorResponse() {}

    public ErrorResponse(int status, String error) {
        this.status = status;
        this.error = error;
    }

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
}
