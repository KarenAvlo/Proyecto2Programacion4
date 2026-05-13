package com.example.proyecto1programacion4.presentation.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class PuestoRequest {

    private String descripcion;
    private BigDecimal salarioOfrecido;
    private String moneda;
    private String tipoPublicacion; // "PUBLICA" o "PRIVADA"
    private List<CaracteristicaNivelRequest> caracteristicas;

    // Getters y Setters
    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public BigDecimal getSalarioOfrecido() {
        return salarioOfrecido;
    }

    public void setSalarioOfrecido(BigDecimal salarioOfrecido) {
        this.salarioOfrecido = salarioOfrecido;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public String getTipoPublicacion() {
        return tipoPublicacion;
    }

    public void setTipoPublicacion(String tipoPublicacion) {
        this.tipoPublicacion = tipoPublicacion;
    }

    public List<CaracteristicaNivelRequest> getCaracteristicas() {
        return caracteristicas;
    }

    public void setCaracteristicas(List<CaracteristicaNivelRequest> caracteristicas) {
        this.caracteristicas = caracteristicas;
    }

    // Inner class
    public static class CaracteristicaNivelRequest {
        private Integer caracteristicaId;
        private Integer nivel;

        public Integer getCaracteristicaId() {
            return caracteristicaId;
        }

        public void setCaracteristicaId(Integer caracteristicaId) {
            this.caracteristicaId = caracteristicaId;
        }

        public Integer getNivel() {
            return nivel;
        }

        public void setNivel(Integer nivel) {
            this.nivel = nivel;
        }
    }
}
