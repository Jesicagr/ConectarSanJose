package com.conectarsj.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "actividades", indexes = {
    @Index(name = "idx_actividad_fecha_inicio", columnList = "fechaInicio")
})
@SQLRestriction("coalesce(activo, true) = true")
@Getter
@Setter
@ToString(exclude = {"creadoPor", "areas", "horarios"})
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    // --- RELACIÓN CON SEDES ---
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sede_id", nullable = false)
    private Sede sede;

    @Column(name = "fecha_inicio")
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDate fechaFin;

    @Column(name = "repetir_todo_anio")
    private Boolean repetirTodoAnio;

    // --- RELACIÓN CON ADMINISTRADOR ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creado_por")
    @JsonIgnore
    private Administrador creadoPor;


    @Column(length = 255)
    private String descripcion_corta;

    @Column(length = 255)
    private String dia;

    @Column(length = 255)
    private String encargado;

    @Column(length = 255)
    private String horario;

    @Column(length = 50)
    private String telefono;

    @Column(length = 30)
    private String status = "Confirmado";

    private Boolean activo = true;

    // --- RELACIÓN MUCHOS A MUCHOS CON AREAS ---
    @ManyToMany(fetch = FetchType.LAZY)
    @BatchSize(size = 30)
    @JoinTable(
            name = "actividad_areas",
            joinColumns = @JoinColumn(name = "actividad_id"),
            inverseJoinColumns = @JoinColumn(name = "area_id")
    )
    private List<Area> areas;

    // --- RELACIÓN CON HORARIOS
    @OneToMany(mappedBy = "actividad", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @BatchSize(size = 30)
    @JsonManagedReference
    private List<HorarioActividad> horarios;
}