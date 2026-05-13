package com.example.proyecto1programacion4.presentation.api;

import com.example.proyecto1programacion4.data.CaracteristicaRepository;
import com.example.proyecto1programacion4.logic.Caracteristica;
import com.example.proyecto1programacion4.presentation.api.dto.CaracteristicaRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/caracteristicas")
public class CaracteristicaRestController {

    private final CaracteristicaRepository caracteristicaRepository;

    public CaracteristicaRestController(CaracteristicaRepository caracteristicaRepository) {
        this.caracteristicaRepository = caracteristicaRepository;
    }

    @GetMapping
    public List<Map<String, Object>> listarTodas() {
        return caracteristicaRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Caracteristica::getNombre))
                .map(this::convertirCaracteristica)
                .toList();
    }

    @GetMapping("/raices")
    public List<Map<String, Object>> listarRaices() {
        return caracteristicaRepository.findByIdPadreIsNull()
                .stream()
                .sorted(Comparator.comparing(Caracteristica::getNombre))
                .map(this::convertirCaracteristica)
                .toList();
    }

    @GetMapping("/{padreId}/hijas")
    public ResponseEntity<List<Map<String, Object>>> listarHijas(@PathVariable Integer padreId) {
        Caracteristica padre = caracteristicaRepository.findById(padreId).orElse(null);

        if (padre == null) {
            return ResponseEntity.notFound().build();
        }

        List<Map<String, Object>> hijas = caracteristicaRepository.findByIdPadre(padre)
                .stream()
                .sorted(Comparator.comparing(Caracteristica::getNombre))
                .map(this::convertirCaracteristica)
                .toList();

        return ResponseEntity.ok(hijas);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> crearCaracteristica(
            @RequestBody CaracteristicaRequest request
    ) {
        Caracteristica caracteristica = new Caracteristica();
        caracteristica.setNombre(request.getNombre());

        if (request.getPadreId() != null) {
            Caracteristica padre = caracteristicaRepository.findById(request.getPadreId()).orElse(null);

            if (padre == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "mensaje", "La característica padre no existe."
                ));
            }

            caracteristica.setIdPadre(padre);
        }

        Caracteristica guardada = caracteristicaRepository.save(caracteristica);

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "mensaje", "Característica creada correctamente.",
                "id", guardada.getId(),
                "nombre", guardada.getNombre()
        ));
    }

    private Map<String, Object> convertirCaracteristica(Caracteristica caracteristica) {
        Map<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id", caracteristica.getId());
        map.put("nombre", caracteristica.getNombre());
        map.put("padreId", caracteristica.getIdPadre() != null ? caracteristica.getIdPadre().getId() : null);
        map.put("padreNombre", caracteristica.getIdPadre() != null ? caracteristica.getIdPadre().getNombre() : "");
        return map;
    }
}
