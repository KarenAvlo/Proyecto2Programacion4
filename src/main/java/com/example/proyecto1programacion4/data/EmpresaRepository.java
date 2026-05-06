package com.example.proyecto1programacion4.data;

import com.example.proyecto1programacion4.logic.Empresa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmpresaRepository extends JpaRepository<Empresa,String> {

    // Buscamos empresas cuyo usuario asociado tenga estado = false (0)


}
