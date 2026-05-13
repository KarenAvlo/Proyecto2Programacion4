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

    @Query("""
            SELECT DISTINCT p
            FROM Puesto p
            JOIN p.puestoCaracteristicas pc
            WHERE LOWER(p.tipoPublicacion) = LOWER(:tipoPublicacion)
              AND p.activo = true
              AND pc.idCaracteristica.id IN :caracteristicaIds
            ORDER BY p.fechaPublicacion DESC
            """)
    List<Puesto> buscarPublicosPorCaracteristicas(
            String tipoPublicacion,
            List<Integer> caracteristicaIds
    );

    List<Puesto> findByTipoPublicacionIgnoreCaseAndActivoTrueOrderByFechaPublicacionDesc(String tipoPublicacion);

    List<Puesto> findTop5ByTipoPublicacionIgnoreCaseAndActivoTrueOrderByFechaPublicacionDesc(String tipoPublicacion);

    @Query(value = "SELECT * FROM puesto WHERE MONTH(fecha_publicacion) = :mes AND YEAR(fecha_publicacion) = 2026",
            nativeQuery = true)
    List<Puesto> findByMes(@Param("mes") int mes);
}
