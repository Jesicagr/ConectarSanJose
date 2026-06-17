package com.conectarsj.backend;

import com.conectarsj.backend.model.Administrador;
import com.conectarsj.backend.model.Rol;
import com.conectarsj.backend.repository.AdministradorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@EnableAsync
public class ConectarSjBackendApplication {

    private static final Logger log = LoggerFactory.getLogger(ConectarSjBackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(ConectarSjBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner init(AdministradorRepository repo, BCryptPasswordEncoder encoder) {
        return args -> {
            if (repo.findByEmail("admin@sanjose.com").isEmpty()) {
                Administrador admin = new Administrador();
                admin.setEmail("admin@sanjose.com");
                admin.setPasswordHash(encoder.encode("admin123"));
                admin.setRol(Rol.SUPER_ADMIN);
                repo.save(admin);
                log.info("Usuario creado: admin@sanjose.com (SUPER_ADMIN)");
            }
            if (repo.findByEmail("jesiagr@gmail.com").isEmpty()) {
                Administrador user2 = new Administrador();
                user2.setEmail("jesiagr@gmail.com");
                user2.setPasswordHash(encoder.encode("admin1919"));
                user2.setRol(Rol.SUPER_ADMIN);
                repo.save(user2);
                log.info("Usuario creado: jesiagr@gmail.com (SUPER_ADMIN)");
            }
        };
    }
}