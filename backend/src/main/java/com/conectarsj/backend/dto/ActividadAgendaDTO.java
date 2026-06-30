package com.conectarsj.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record ActividadAgendaDTO(
    Long id,
    String titulo,
    String descripcion,
    String descripcion_corta,
    LocalDate fechaInicio,
    LocalDate fechaFin,
    String telefono,
    String encargado,
    String status,
    SedeDTO sede,
    List<AreaDTO> areas,
    List<HorarioDTO> horarios
) {
    public record SedeDTO(Integer id, String nombre, String direccion, String telefono, Boolean esWhatsapp, String icono) {}
    public record AreaDTO(Integer id, String nombre) {}
    public record HorarioDTO(String diaSemana, String horaInicio, String horaFin) {}
}
