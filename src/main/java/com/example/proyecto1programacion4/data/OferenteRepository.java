package com.example.proyecto1programacion4.data;
import com.example.proyecto1programacion4.logic.Oferente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface OferenteRepository extends JpaRepository<Oferente,String> {

    Optional<Oferente> findByCedula(String cedula);

    Optional<Oferente> findByEmail(String email);
}