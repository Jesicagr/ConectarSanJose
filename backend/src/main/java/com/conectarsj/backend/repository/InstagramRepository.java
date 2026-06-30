package com.conectarsj.backend.repository;

import com.conectarsj.backend.model.PublicacionInstagram;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InstagramRepository extends JpaRepository<PublicacionInstagram, Long> {
    List<PublicacionInstagram> findByUsernameOrderByPostTimestampDesc(String username);
    List<PublicacionInstagram> findAllByOrderByPostTimestampDesc();
    List<PublicacionInstagram> findByUsernameInOrderByPostTimestampDesc(List<String> usernames);
    void deleteByUsername(String username);
    long countByUsername(String username);
    Optional<PublicacionInstagram> findByShortcode(String shortcode);
}
