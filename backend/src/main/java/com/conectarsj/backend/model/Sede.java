package com.conectarsj.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sedes")
@SQLRestriction("coalesce(activo, true) = true")
public class Sede {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(length = 200)
    private String direccion;

    @Column(length = 50)
    private String telefono;

    @Column(length = 50)
    private String icono;

    @Column(name = "es_whatsapp")
    private Boolean esWhatsapp = false;

    @Column(name = "latitud")
    private Double latitud;

    @Column(name = "longitud")
    private Double longitud;

    private Boolean activo = true;

    @OneToMany(mappedBy = "sede", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<HorarioSede> horarios = new ArrayList<>();

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getIcono() { return icono; }
    public void setIcono(String icono) { this.icono = icono; }

    public Boolean getEsWhatsapp() { return esWhatsapp; }
    public void setEsWhatsapp(Boolean esWhatsapp) { this.esWhatsapp = esWhatsapp; }

    public Double getLatitud() { return latitud; }
    public void setLatitud(Double latitud) { this.latitud = latitud; }

    public Double getLongitud() { return longitud; }
    public void setLongitud(Double longitud) { this.longitud = longitud; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public List<HorarioSede> getHorarios() { return horarios; }
    public void setHorarios(List<HorarioSede> horarios) { this.horarios = horarios; }
}
