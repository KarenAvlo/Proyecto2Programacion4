package com.example.proyecto1programacion4.presentation.api.dto;

import java.util.List;

public class HabilidadRequest {

    private List<HabilidadItem> habilidades;

    public List<HabilidadItem> getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(List<HabilidadItem> habilidades) {
        this.habilidades = habilidades;
    }

    public static class HabilidadItem {
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
