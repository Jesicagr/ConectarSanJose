package com.conectarsj.backend.controller;

import com.conectarsj.backend.dto.ActividadResumenDTO;
import com.conectarsj.backend.dto.ErrorResponse;
import com.conectarsj.backend.model.Actividad;
import com.conectarsj.backend.model.DiaSemana;
import com.conectarsj.backend.service.ActividadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/actividades")
@Tag(name = "Actividades", description = "CRUD de actividades comunitarias")
public class ActividadController {

    private static final Logger log = LoggerFactory.getLogger(ActividadController.class);

    @Autowired
    private ActividadService actividadService;

    @Operation(summary = "Listar todas las actividades", description = "Devuelve todas las actividades ordenadas por agenda")
    @ApiResponse(responseCode = "200", description = "Lista de actividades", content = @Content(schema = @Schema(implementation = Actividad.class)))
    @GetMapping
    public List<Actividad> listarTodas() {
        return actividadService.obtenerTodasOrdenadas();
    }

    @Operation(summary = "Listar actividades por día de semana", description = "Devuelve actividades que tienen horarios en el día indicado (LUNES, MARTES, etc.)")
    @GetMapping("/dia/{diaSemana}")
    public List<Actividad> listarPorDiaSemana(@PathVariable DiaSemana diaSemana) {
        return actividadService.obtenerPorDiaSemana(diaSemana);
    }

    @Operation(summary = "Contar actividades", description = "Devuelve el total de actividades registradas")
    @ApiResponse(responseCode = "200", description = "Total de actividades")
    @GetMapping("/count")
    public Map<String, Long> contar() {
        return Map.of("total", actividadService.contarTotal());
    }

    @Operation(summary = "Listar actividades paginadas", description = "Devuelve actividades en formato resumen con paginación")
    @ApiResponse(responseCode = "200", description = "Página de actividades", content = @Content(schema = @Schema(implementation = ActividadResumenDTO.class)))
    @GetMapping("/paginated")
    public Page<ActividadResumenDTO> listarPaginadas(
            @Parameter(description = "Número de página (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamaño de página") @RequestParam(defaultValue = "20") int size) {
        if (size > 100) {
            log.warn("Solicitud de paginación con tamaño {} (>100) desde IP {}, posible consumo excesivo", size);
        }
        return actividadService.obtenerResumenPaginado(PageRequest.of(page, size, Sort.by("fechaInicio").descending()));
    }

    @Operation(summary = "Obtener actividad por ID", description = "Devuelve una actividad específica por su identificador")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Actividad encontrada", content = @Content(schema = @Schema(implementation = Actividad.class))),
        @ApiResponse(responseCode = "404", description = "Actividad no encontrada", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<Actividad> obtenerPorId(@PathVariable Long id) {
        return actividadService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Listar actividades por área", description = "Devuelve las actividades que pertenecen a un área específica")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de actividades del área", content = @Content(schema = @Schema(implementation = Actividad.class))),
        @ApiResponse(responseCode = "404", description = "Área no encontrada", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @GetMapping("/area/{areaId}")
    public List<Actividad> listarPorArea(@PathVariable Integer areaId) {
        return actividadService.obtenerActividadesPorArea(areaId);
    }

    @Operation(summary = "Crear actividad", description = "Registra una nueva actividad en el sistema")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Actividad creada", content = @Content(schema = @Schema(implementation = Actividad.class))),
        @ApiResponse(responseCode = "400", description = "Datos inválidos", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping
    public Actividad crear(@RequestBody Actividad actividad) {
        return actividadService.guardar(actividad);
    }

    @Operation(summary = "Actualizar actividad", description = "Actualiza los datos de una actividad existente")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Actividad actualizada", content = @Content(schema = @Schema(implementation = Actividad.class))),
        @ApiResponse(responseCode = "404", description = "Actividad no encontrada", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<Actividad> actualizar(@PathVariable Long id, @RequestBody Actividad actividad) {
        try {
            Actividad actualizada = actividadService.actualizar(id, actividad);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Eliminar actividad", description = "Elimina una actividad por su ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Actividad eliminada"),
        @ApiResponse(responseCode = "404", description = "Actividad no encontrada", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (actividadService.obtenerPorId(id).isPresent()) {
            actividadService.eliminar(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}