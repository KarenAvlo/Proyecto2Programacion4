package com.example.proyecto1programacion4.data;

import com.example.proyecto1programacion4.logic.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;



public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Integer> {
    // Corregido: Busca registros donde el objeto 'idPadre' sea nulo (Categorías Raíz)
    List<Caracteristica> findByIdPadreIsNull();

    // Spring leerá: "Buscar por el atributo idPadre"
    List<Caracteristica> findByIdPadre(Caracteristica padre);

    Caracteristica findByNombre(String caracteristica);
}