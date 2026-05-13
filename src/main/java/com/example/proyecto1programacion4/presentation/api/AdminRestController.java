package com.example.proyecto1programacion4.presentation.api;

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

    public AdminRestController(LogicService logicService) {
        this.logicService = logicService;
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

    private Map<String, Object> convertirUsuarioPendiente(Usuario usuario) {
        return Map.of(
                "email", usuario.getEmail(),
                "tipo", usuario.getTipo(),
                "estado", usuario.getEstado()
        );
    }
}
