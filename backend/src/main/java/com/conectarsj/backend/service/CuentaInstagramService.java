package com.conectarsj.backend.service;

import com.conectarsj.backend.model.CuentaInstagram;
import com.conectarsj.backend.repository.CuentaInstagramRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CuentaInstagramService {

    private final CuentaInstagramRepository repository;
    private final InstagramScraperService scraperService;

    public CuentaInstagramService(CuentaInstagramRepository repository, InstagramScraperService scraperService) {
        this.repository = repository;
        this.scraperService = scraperService;
    }

    public List<CuentaInstagram> listarActivas() {
        return repository.findByActivoTrueOrderByOrdenAsc();
    }

    public List<CuentaInstagram> listarTodas() {
        return repository.findAll();
    }

    @Transactional
    public CuentaInstagram agregar(String username) {
        if (repository.existsByUsername(username)) {
            CuentaInstagram existente = repository.findByUsername(username).orElseThrow();
            if (!existente.getActivo()) {
                existente.setActivo(true);
                return repository.save(existente);
            }
            throw new IllegalArgumentException("La cuenta ya existe: @" + username);
        }
        int orden = (int) repository.count();
        CuentaInstagram cuenta = new CuentaInstagram(username, orden);
        return repository.save(cuenta);
    }

    @Transactional
    public void eliminar(Long id) {
        CuentaInstagram cuenta = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada"));
        cuenta.setActivo(false);
        repository.save(cuenta);
    }

    @Transactional
    public CuentaInstagram actualizar(Long id, String username, Boolean activo) {
        CuentaInstagram cuenta = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cuenta no encontrada"));
        if (username != null) {
            if (!cuenta.getUsername().equals(username) && repository.existsByUsername(username)) {
                throw new IllegalArgumentException("El username @" + username + " ya existe");
            }
            cuenta.setUsername(username);
        }
        if (activo != null) {
            cuenta.setActivo(activo);
        }
        return repository.save(cuenta);
    }

    @Transactional
    public void refrescar(String username) {
        scraperService.refrescarCuenta(username);
    }

    @Transactional
    public void refrescarTodas() {
        List<CuentaInstagram> activas = listarActivas();
        for (CuentaInstagram c : activas) {
            scraperService.refrescarCuenta(c.getUsername());
        }
    }

    @Transactional
    public void seedIfEmpty() {
        if (repository.count() > 0) return;
        String[] defaults = {
            "munisanjoseer", "sjmujeresgenerodiversidad", "sjsaludybienestarsocial",
            "sjareadeinclusion", "caps.sjciudad", "sjdeportes",
            "turismosanjose", "sjcultura_", "sjeducacion", "sjareadejuventudes"
        };
        for (int i = 0; i < defaults.length; i++) {
            repository.save(new CuentaInstagram(defaults[i], i));
        }
    }
}
