/**
 * REPOSITORIO DE ACTIVIDADES
 * Esta interfaz maneja la comunicación directa con la base de datos.
 * Al heredar de JpaRepository, Spring da automáticamente todos los métodos
 * del CRUD. También está la consulta para ordenar la agenda.
 * */
package com.conectarsj.backend.repository;

import com.conectarsj.backend.model.Actividad;
import com.conectarsj.backend.model.DiaSemana;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {

    @Query("SELECT a FROM Actividad a ORDER BY a.fechaInicio DESC")
    List<Actividad> findAllOrdenadoPorAgenda();

    @Query("SELECT DISTINCT a FROM Actividad a JOIN FETCH a.horarios h WHERE h.diaSemana = :dia ORDER BY a.fechaInicio DESC")
    List<Actividad> findByDiaSemana(@Param("dia") DiaSemana dia);

    @Query("SELECT a FROM Actividad a JOIN a.areas ar WHERE ar.id = :areaId ORDER BY a.fechaInicio DESC")
    List<Actividad> findByAreaId(@Param("areaId") Integer areaId);

    @Query(value = "SELECT a FROM Actividad a ORDER BY a.fechaInicio DESC",
           countQuery = "SELECT COUNT(a) FROM Actividad a")
    Page<Actividad> findAllOrdenadoPorAgenda(Pageable pageable);

    @Query("SELECT COUNT(a) FROM Actividad a")
    long countTotal();
}
