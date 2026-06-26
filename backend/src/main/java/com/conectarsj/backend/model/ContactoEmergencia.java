package com.conectarsj.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Entity
@Table(name = "contactos_emergencia")
@SQLRestriction("coalesce(activo, true) = true")
@Data
public class ContactoEmergencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre_institucion", nullable = false, length = 100)
    private String nombreInstitucion;

    @ElementCollection
    @CollectionTable(name = "contacto_telefonos", joinColumns = @JoinColumn(name = "contacto_id"))
    private List<TelefonoContacto> telefonos;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 50)
    private String icono;

    @Column(length = 50)
    private String categoria;

    @Column(name = "orden_prioridad")
    private Integer ordenPrioridad;

    private Boolean activo = true;
}
