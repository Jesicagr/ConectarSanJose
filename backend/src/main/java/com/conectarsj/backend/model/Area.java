package com.conectarsj.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Entity
@Table(name = "areas")
@SQLRestriction("coalesce(activo, true) = true")
@Data
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 50)
    private String icono;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 50)
    private String telefono;

    @Column(name = "es_whatsapp")
    private Boolean esWhatsapp = false;

    @Column(name = "telefono_etiqueta", length = 50)
    private String telefonoEtiqueta;

    @Column(length = 100)
    private String referente;

    @Column(length = 200)
    private String direccion;

    @Column(length = 150)
    private String email;

    @Column(length = 200)
    private String redes;

    @Column(name = "sitio_web", length = 500)
    private String sitioWeb;

    @Column(length = 200)
    private String horarioAtencion;

    private Boolean activo = true;

    @ElementCollection
    @BatchSize(size = 30)
    @CollectionTable(name = "area_telefonos", joinColumns = @JoinColumn(name = "area_id"))
    private List<TelefonoContacto> telefonos;
}
