/**
 * SERVICIO DE ACTIVIDADES
 * Esta clase contiene la lógica de negocio del módulo de Actividades.
 * Se encarga de intermediar entre los endpoints (Controlador) y la base de datos (Repositorio),
 * asegurando que los datos se procesen correctamente antes de ser guardados o enviados.
 */
package com.conectarsj.backend.service;

import com.conectarsj.backend.dto.ActividadResumenDTO;
import com.conectarsj.backend.model.Actividad;
import com.conectarsj.backend.repository.ActividadRepository;
import com.conectarsj.backend.exceptions.FechaInvalidaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ActividadService {

    @Autowired
    private ActividadRepository actividadRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<Actividad> obtenerTodasOrdenadas() {
        return actividadRepository.findAllOrdenadoPorAgenda();
    }

    @Transactional(readOnly = true)
    public Page<Actividad> obtenerPaginadas(Pageable pageable) {
        return actividadRepository.findAllOrdenadoPorAgenda(pageable);
    }

    public long contarTotal() {
        return actividadRepository.countTotal();
    }

    public Page<ActividadResumenDTO> obtenerResumenPaginado(Pageable pageable) {
        long total = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM actividades", Long.class);

        String sql = """
            SELECT a.id, a.titulo, a.descripcion, a.fecha_inicio, a.fecha_fin,
                   COALESCE(a.status, 'Confirmado') AS status, a.encargado, a.telefono,
                   ARRAY(SELECT ar.nombre FROM areas ar
                         JOIN actividad_areas aa ON aa.area_id = ar.id
                         WHERE aa.actividad_id = a.id
                         ORDER BY ar.nombre) AS area_nombres,
                   ARRAY(SELECT ar.icono FROM areas ar
                         JOIN actividad_areas aa ON aa.area_id = ar.id
                         WHERE aa.actividad_id = a.id
                         ORDER BY ar.nombre) AS area_iconos,
                   s.nombre AS sede_nombre,
                   (SELECT STRING_AGG(
                              CONCAT(h.dia_semana, ' ', TO_CHAR(h.hora_inicio, 'HH24:MI'),
                                     COALESCE(' - ' || TO_CHAR(h.hora_fin, 'HH24:MI'), '')),
                              ' | ')
                    FROM horarios_actividad h
                    WHERE h.actividad_id = a.id) AS horario
            FROM actividades a
            JOIN sedes s ON s.id = a.sede_id
            ORDER BY a.fecha_inicio DESC
            OFFSET ? LIMIT ?
        """;

        List<ActividadResumenDTO> dtos = jdbcTemplate.query(
            sql,
            (rs, rowNum) -> {
                LocalDate fechaInicio = rs.getDate("fecha_inicio") != null
                    ? rs.getDate("fecha_inicio").toLocalDate()
                    : null;
                LocalDate fechaFin = rs.getDate("fecha_fin") != null
                    ? rs.getDate("fecha_fin").toLocalDate()
                    : null;

                java.sql.Array areaNombresArr = rs.getArray("area_nombres");
                java.sql.Array areaIconosArr = rs.getArray("area_iconos");
                List<String> areaNombres = areaNombresArr != null
                    ? Arrays.asList((String[]) areaNombresArr.getArray())
                    : Collections.emptyList();
                List<String> areaIconos = areaIconosArr != null
                    ? Arrays.asList((String[]) areaIconosArr.getArray())
                    : Collections.emptyList();

                return new ActividadResumenDTO(
                    rs.getLong("id"),
                    rs.getString("titulo"),
                    rs.getString("descripcion"),
                    fechaInicio,
                    fechaFin,
                    rs.getString("status"),
                    rs.getString("encargado"),
                    areaNombres,
                    areaIconos,
                    rs.getString("sede_nombre"),
                    rs.getString("horario"),
                    rs.getString("telefono")
                );
            },
            pageable.getOffset(),
            pageable.getPageSize()
        );

        return new PageImpl<>(dtos, pageable, total);
    }

    @Transactional(readOnly = true)
    public Optional<Actividad> obtenerPorId(Long id) {
        return actividadRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Actividad> obtenerActividadesPorArea(Integer areaId) {
        return actividadRepository.findByAreaId(areaId);
    }

    public Actividad guardar(Actividad actividad) {
        if (actividad.getFechaInicio() != null && actividad.getFechaInicio().isBefore(LocalDate.now())) {
            throw new FechaInvalidaException("No se puede registrar una actividad con una fecha de inicio anterior a hoy.");
        }
        if (actividad.getHorarios() != null) {
            actividad.getHorarios().forEach(horario -> horario.setActividad(actividad));
        }
        return actividadRepository.save(actividad);
    }

    @Transactional
    public Actividad actualizar(Long id, Actividad actividad) {
        return actividadRepository.findById(id)
            .map(existente -> {
                existente.setTitulo(actividad.getTitulo());
                existente.setDescripcion(actividad.getDescripcion());
                existente.setDescripcion_corta(actividad.getDescripcion_corta());
                existente.setFechaInicio(actividad.getFechaInicio());
                existente.setFechaFin(actividad.getFechaFin());
                existente.setDia(actividad.getDia());
                existente.setEncargado(actividad.getEncargado());
                existente.setTelefono(actividad.getTelefono());
                existente.setHorario(actividad.getHorario());
                existente.setStatus(actividad.getStatus());
                existente.setSede(actividad.getSede());
                existente.setAreas(actividad.getAreas());
                existente.setRepetirTodoAnio(actividad.getRepetirTodoAnio());
                if (actividad.getHorarios() != null) {
                    actividad.getHorarios().forEach(h -> h.setActividad(existente));
                    existente.getHorarios().clear();
                    existente.getHorarios().addAll(actividad.getHorarios());
                }
                return actividadRepository.save(existente);
            })
            .orElseThrow(() -> new RuntimeException("Actividad no encontrada con id: " + id));
    }

    public void eliminar(Long id) {
        actividadRepository.deleteById(id);
    }
}
