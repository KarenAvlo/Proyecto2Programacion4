package com.example.proyecto1programacion4.presentation.api.dto;

public class CaracteristicaRequest {

    private String nombre;
    private Integer padreId;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getPadreId() {
        return padreId;
    }

    public void setPadreId(Integer padreId) {
        this.padreId = padreId;
    }
}
