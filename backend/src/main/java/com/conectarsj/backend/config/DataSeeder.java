package com.conectarsj.backend.config;

import com.conectarsj.backend.model.Area;
import com.conectarsj.backend.repository.AreaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AreaRepository areaRepository;

    @Override
    public void run(String... args) throws Exception {
        if (areaRepository.count() == 0) {
            List<Area> areas = Arrays.asList(
                    crearArea("Mujer", "female"),
                    crearArea("Niñez", "child_care"),
                    crearArea("Personas Mayores", "elderly"),
                    crearArea("Desarrollo Comunitario", "campaign"),
                    crearArea("Discapacidad", "accessible"),
                    crearArea("Salud", "monitor_heart"),
                    crearArea("Trabajo", "engineering"),
                    crearArea("Deportes", "sports_rugby"),
                    crearArea("Turismo", "hiking"),
                    crearArea("Cultura", "account_balance"),
                    crearArea("Educación", "school")
            );
            areaRepository.saveAll(areas);
            System.out.println("Áreas inicializadas en la base de datos.");
        }
    }

    private Area crearArea(String nombre, String icono) {
        Area area = new Area();
        area.setNombre(nombre);
        area.setIcono(icono);
        return area;
    }
}
