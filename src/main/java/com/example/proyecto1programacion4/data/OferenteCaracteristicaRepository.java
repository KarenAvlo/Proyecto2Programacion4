package com.example.proyecto1programacion4.data;


import com.example.proyecto1programacion4.logic.OferenteCaracteristica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OferenteCaracteristicaRepository extends JpaRepository<OferenteCaracteristica, Integer> {
    List<OferenteCaracteristica> findByCedulaOferenteCedula(String cedula);

    Optional<OferenteCaracteristica> findByCedulaOferenteEmailAndIdCaracteristicaId(String email, Integer caracteristicaId);

}
