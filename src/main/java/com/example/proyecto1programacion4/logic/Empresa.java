package com.example.proyecto1programacion4.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "empresa")
public class Empresa extends Usuario{



    @Size(max = 100)
    @NotNull
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Size(max = 200)
    @Column(name = "localizacion", length = 200)
    private String localizacion;

    @Size(max = 20)
    @Column(name = "telefono", length = 20)
    private String telefono;

    @Lob
    @Column(name = "descripcion")
    private String descripcion;


}