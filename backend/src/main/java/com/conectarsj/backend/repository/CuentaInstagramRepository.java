package com.conectarsj.backend.repository;

import com.conectarsj.backend.model.CuentaInstagram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CuentaInstagramRepository extends JpaRepository<CuentaInstagram, Long> {
    List<CuentaInstagram> findByActivoTrueOrderByOrdenAsc();
    Optional<CuentaInstagram> findByUsername(String username);
    boolean existsByUsername(String username);
}
