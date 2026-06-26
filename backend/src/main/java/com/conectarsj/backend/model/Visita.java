package com.conectarsj.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDate;

@Entity
@Table(name = "visitas")
@SQLRestriction("coalesce(activo, true) = true")
@Data
public class Visita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String pagina;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "contador", nullable = false)
    private Integer contador = 1;

    private Boolean activo = true;
}
