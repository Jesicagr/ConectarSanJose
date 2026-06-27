package com.conectarsj.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MigrationService {

    @PersistenceContext
    private EntityManager entityManager;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void migrarActivo() {
        entityManager.createNativeQuery("UPDATE actividades SET activo = true WHERE activo IS NULL").executeUpdate();
        entityManager.createNativeQuery("UPDATE areas SET activo = true WHERE activo IS NULL").executeUpdate();
        entityManager.createNativeQuery("UPDATE sedes SET activo = true WHERE activo IS NULL").executeUpdate();
        entityManager.createNativeQuery("UPDATE administrador SET activo = true WHERE activo IS NULL").executeUpdate();
        entityManager.createNativeQuery("UPDATE visitas SET activo = true WHERE activo IS NULL").executeUpdate();
        entityManager.createNativeQuery("UPDATE areas SET nombre = 'Inclusión' WHERE nombre = 'Discapacidad'").executeUpdate();
    }
}
