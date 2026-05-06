package com.example.proyecto1programacion4.data;

import com.example.proyecto1programacion4.logic.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdministradorRepository extends JpaRepository<Usuario, String> {

}
