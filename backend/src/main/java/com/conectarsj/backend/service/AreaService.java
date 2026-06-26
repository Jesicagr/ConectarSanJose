package com.conectarsj.backend.service;

import com.conectarsj.backend.model.Area;
import com.conectarsj.backend.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AreaService {

    @Autowired
    private AreaRepository areaRepository;

    public List<Area> obtenerTodas() {
        return areaRepository.findAll();
    }

    public Optional<Area> obtenerPorId(Integer id) {
        return areaRepository.findById(id);
    }

    public Area guardar(Area area) {
        return areaRepository.save(area);
    }

    public void eliminar(Integer id) {
        areaRepository.findById(id).ifPresent(a -> {
            a.setActivo(false);
            areaRepository.save(a);
        });
    }
}
