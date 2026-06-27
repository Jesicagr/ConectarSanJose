package com.conectarsj.backend.service;

import com.conectarsj.backend.model.ContactoEmergencia;
import com.conectarsj.backend.model.TelefonoContacto;
import com.conectarsj.backend.repository.ContactoEmergenciaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ContactoEmergenciaService {

    @Autowired
    private ContactoEmergenciaRepository contactoEmergenciaRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedData() {
        if (contactoEmergenciaRepository.count() > 0) {
            return;
        }

        guardar(crearContacto("Policía San José", List.of(new TelefonoContacto("101", false)), "Emergencias, seguridad, control de tránsito y convivencia ciudadana.", "local_police", "Seguridad", null));
        guardar(crearContacto("Policía San José (líneas directas)", List.of(new TelefonoContacto("(03447) 470111", false), new TelefonoContacto("(0343) 15 4602245", true), new TelefonoContacto("(0343) 15 4690531", true)), "Líneas directas de la comisaría local.", "local_police", "Seguridad", null));
        guardar(crearContacto("Policía El Brillante", List.of(new TelefonoContacto("(03447) 494006", false), new TelefonoContacto("(0343) 15 4601884", true)), "Seguridad del barrio El Brillante.", "local_police", "Seguridad", null));
        guardar(crearContacto("Defensa Civil / Bomberos", List.of(new TelefonoContacto("100", false)), "Atención de incendios, rescates y emergencias climáticas.", "fire_extinguisher", "Emergencia", null));
        guardar(crearContacto("Defensa Civil (línea directa)", List.of(new TelefonoContacto("(03447) 470890", false)), "Línea directa de Defensa Civil.", "fire_extinguisher", "Emergencia", null));
        guardar(crearContacto("Hospital San José", List.of(new TelefonoContacto("470894", false), new TelefonoContacto("(03447) 15 437111", true)), "Hospital público local. Atención médica de emergencia y consultas.", "local_hospital", "Salud", null));
        guardar(crearContacto("Urgencias de Salud Mental (Entre Ríos)", List.of(new TelefonoContacto("0800-777-2100", false)), "Línea provincial de contención y urgencias en salud mental. Atención las 24 horas.", "psychology", "Salud", 1));
        guardar(crearContacto("Centro de Asistencia al Suicida (Nacional)", List.of(new TelefonoContacto("0800-345-1435", false), new TelefonoContacto("135", false)), "Línea nacional de prevención del suicidio y contención emocional.", "help_center", "Salud", 2));
        guardar(crearContacto("Niñez, Adolescencia y Familia", List.of(new TelefonoContacto("3447-146499", false), new TelefonoContacto("3447-146499", true)), "Protección y asistencia integral a la niñez, adolescencia y familia. Guardia 24hs.", "child_friendly", "Social", 3));
        guardar(crearContacto("Mujeres, Género y Diversidad", List.of(new TelefonoContacto("3447-438343", false), new TelefonoContacto("3447-438343", true)), "Asistencia y acompañamiento a mujeres y diversidades en situaciones de violencia de género.", "female", "Social", 4));
    }

    private ContactoEmergencia crearContacto(String nombreInstitucion, List<TelefonoContacto> telefonos, String descripcion, String icono, String categoria, Integer ordenPrioridad) {
        ContactoEmergencia c = new ContactoEmergencia();
        c.setNombreInstitucion(nombreInstitucion);
        c.setTelefonos(telefonos);
        c.setDescripcion(descripcion);
        c.setIcono(icono);
        c.setCategoria(categoria);
        c.setOrdenPrioridad(ordenPrioridad);
        return c;
    }

    public List<ContactoEmergencia> obtenerTodos() {
        return contactoEmergenciaRepository.findAll();
    }

    public Optional<ContactoEmergencia> obtenerPorId(Integer id) {
        return contactoEmergenciaRepository.findById(id);
    }

    public ContactoEmergencia guardar(ContactoEmergencia contacto) {
        return contactoEmergenciaRepository.save(contacto);
    }

    public void eliminar(Integer id) {
        contactoEmergenciaRepository.findById(id).ifPresent(c -> {
            c.setActivo(false);
            contactoEmergenciaRepository.save(c);
        });
    }
}
