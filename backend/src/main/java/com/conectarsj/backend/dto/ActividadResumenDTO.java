package com.conectarsj.backend.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.util.List;

@Schema(description = "Resumen de actividad para listados paginados")
public record ActividadResumenDTO(
    @Schema(description = "ID de la actividad", example = "1") Long id,
    @Schema(description = "Título de la actividad", example = "Taller de huerta") String titulo,
    @Schema(description = "Descripción breve", example = "Aprende a cultivar tus propios alimentos") String descripcion,
    @Schema(description = "Fecha de inicio", example = "2026-06-15") LocalDate fechaInicio,
    @Schema(description = "Fecha de fin", example = "2026-06-20") LocalDate fechaFin,
    @Schema(description = "Estado", example = "Confirmado") String status,
    @Schema(description = "Persona encargada", example = "María López") String encargado,
    @Schema(description = "Nombres de las áreas asociadas") List<String> areaNombres,
    @Schema(description = "Iconos de las áreas asociadas") List<String> areaIconos,
    @Schema(description = "Nombre de la sede", example = "Polideportivo Municipal") String sedeNombre,
    @Schema(description = "Horario de la actividad", example = "LUNES 10:00 - 12:00") String horario,
    @Schema(description = "Teléfono de contacto", example = "264-1234567") String telefono
) {}
