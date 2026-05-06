package com.example.proyecto1programacion4.data;

import com.example.proyecto1programacion4.logic.Empresa;
import com.example.proyecto1programacion4.logic.Puesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PuestoRepository extends JpaRepository<Puesto, Integer> {
    // Busca puestos filtrando por el email de la empresa dueña
    List<Puesto> findByEmailEmpresa(Empresa empresa);

    @Query(value = "SELECT * FROM puesto WHERE MONTH(fecha_publicacion) = :mes AND YEAR(fecha_publicacion) = 2026",
            nativeQuery = true)
    List<Puesto> findByMes(@Param("mes") int mes);
}
