package com.example.proyecto1programacion4.presentation.api;

import com.example.proyecto1programacion4.data.CaracteristicaRepository;
import com.example.proyecto1programacion4.logic.Caracteristica;
import com.example.proyecto1programacion4.logic.LogicService;
import com.example.proyecto1programacion4.logic.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final LogicService logicService;
    //private final CaracteristicaRepository caracteristicaRepository;

    public AdminRestController(LogicService logicService, CaracteristicaRepository caracteristicaRepository) {
        this.logicService = logicService;
        //this.caracteristicaRepository = caracteristicaRepository;
    }

    @GetMapping("/empresas/pendientes")
    public List<Map<String, Object>> listarEmpresasPendientes() {
        return logicService.findEmpresasPendientes()
                .stream()
                .map(this::convertirUsuarioPendiente)
                .toList();
    }

    @GetMapping("/oferentes/pendientes")
    public List<Map<String, Object>> listarOferentesPendientes() {
        return logicService.findOferentesPendientes()
                .stream()
                .map(this::convertirUsuarioPendiente)
                .toList();
    }

    @PutMapping("/empresas/{email}/aprobar")
    public ResponseEntity<Map<String, Object>> aprobarEmpresa(@PathVariable String email) {
        logicService.aprobarUsuario(email);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Empresa aprobada correctamente."
        ));
    }

    @PutMapping("/oferentes/{email}/aprobar")
    public ResponseEntity<Map<String, Object>> aprobarOferente(@PathVariable String email) {
        logicService.aprobarUsuario(email);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Oferente aprobado correctamente."
        ));
    }
/*
    @GetMapping("/caracteristicas")
    public List<Caracteristica> obtenerCaracteristicas() {
        return caracteristicaRepository.findAll();
    }

    @GetMapping("/caracteristicas/raices")
    public List<Caracteristica> obtenerRaices() {
        return caracteristicaRepository.findByIdPadreIsNull();
    }

    @GetMapping("/caracteristicas/padre/{padreId}")
    public List<Caracteristica> obtenerPorPadre(@PathVariable Integer padreId) {
        Caracteristica padre = caracteristicaRepository.findById(padreId).orElse(null);
        if (padre == null) {
            return List.of();
        }
        return caracteristicaRepository.findByIdPadre(padre);
    }

    @PostMapping("/caracteristicas")
    public ResponseEntity<Caracteristica> crearCaracteristica(
            @RequestParam String nombre,
            @RequestParam(required = false) Integer padreId) {
        Caracteristica nueva = new Caracteristica();
        nueva.setNombre(nombre);

        if (padreId != null) {
            Caracteristica padre = caracteristicaRepository.findById(padreId).orElse(null);
            nueva.setIdPadre(padre);
        }

        Caracteristica guardada = caracteristicaRepository.save(nueva);
        return ResponseEntity.ok(guardada);
    }

    @DeleteMapping("/caracteristicas/{id}")
    public ResponseEntity<Map<String, Object>> eliminarCaracteristica(@PathVariable Integer id) {
        caracteristicaRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("mensaje", "Característica eliminada correctamente"));
    }
*/
    private Map<String, Object> convertirUsuarioPendiente(Usuario usuario) {
        return Map.of(
                "email", usuario.getEmail(),
                "tipo", usuario.getTipo(),
                "estado", usuario.getEstado()
        );
    }
    //nota
}