package com.example.proyecto1programacion4.data;


import com.example.proyecto1programacion4.logic.OferenteCaracteristica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OferenteCaracteristicaRepository extends JpaRepository<OferenteCaracteristica, Integer> {
    List<OferenteCaracteristica> findByCedulaOferente(String cedula);


    List<OferenteCaracteristica> findByCedulaOferenteCedula(String cedula);

}