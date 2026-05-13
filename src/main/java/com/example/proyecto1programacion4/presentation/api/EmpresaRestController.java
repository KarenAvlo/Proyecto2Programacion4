package com.example.proyecto1programacion4.presentation.api;

import com.example.proyecto1programacion4.data.CaracteristicaRepository;
import com.example.proyecto1programacion4.data.PuestoRepository;
import com.example.proyecto1programacion4.logic.Empresa;
import com.example.proyecto1programacion4.logic.LogicService;
import com.example.proyecto1programacion4.logic.Puesto;
import com.example.proyecto1programacion4.logic.PuestoCaracteristica;
import com.example.proyecto1programacion4.presentation.api.dto.PuestoRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaRestController {

    private final LogicService logicService;
    private final PuestoRepository puestoRepository;
    private final CaracteristicaRepository caracteristicaRepository;

    public EmpresaRestController(
            LogicService logicService,
            PuestoRepository puestoRepository,
            CaracteristicaRepository caracteristicaRepository
    ) {
        this.logicService = logicService;
        this.puestoRepository = puestoRepository;
        this.caracteristicaRepository = caracteristicaRepository;
    }

    /**
     * Obtener los datos de la empresa autenticada
     */
    @GetMapping("/perfil")
    public ResponseEntity<Map<String, Object>> obtenerPerfil(Authentication authentication) {
        String email = authentication.getName();
        Empresa empresa = logicService.buscarEmpresaPorEmail(email);

        if (empresa == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(Map.of(
                "email", empresa.getEmail(),
                "nombre", empresa.getNombre(),
                "telefono", empresa.getTelefono(),
                "localizacion", empresa.getLocalizacion(),
                "descripcion", empresa.getDescripcion()
        ));
    }

    /**
     * Crear un nuevo puesto de trabajo
     */
    @PostMapping("/puestos")
    public ResponseEntity<Map<String, Object>> crearPuesto(
            Authentication authentication,
            @RequestBody PuestoRequest request
    ) {
        try {
            String emailEmpresa = authentication.getName();
            Empresa empresa = logicService.buscarEmpresaPorEmail(emailEmpresa);

            if (empresa == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "mensaje", "Empresa no encontrada."
                ));
            }

            // Crear el puesto
            Puesto puesto = new Puesto();
            puesto.setEmailEmpresa(empresa);
            puesto.setDescripcion(request.getDescripcion());
            puesto.setSalarioOfrecido(request.getSalarioOfrecido());
            puesto.setMoneda(request.getMoneda());
            puesto.setTipoPublicacion(request.getTipoPublicacion());
            puesto.setActivo(true);

            Puesto puestoGuardado = logicService.guardarPuesto(puesto);

            // Guardar características del puesto
            if (request.getCaracteristicas() != null && !request.getCaracteristicas().isEmpty()) {
                for (PuestoRequest.CaracteristicaNivelRequest car : request.getCaracteristicas()) {
                    logicService.guardarPuestoCaracteristica(
                            puestoGuardado,
                            car.getCaracteristicaId(),
                            car.getNivel()
                    );
                }
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Puesto publicado correctamente.",
                    "id", puestoGuardado.getId()
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "mensaje", ex.getMessage()
            ));
        }
    }

    /**
     * Listar puestos de la empresa autenticada
     */
    @GetMapping("/puestos")
    public ResponseEntity<List<Map<String, Object>>> listarPuestos(Authentication authentication) {
        String email = authentication.getName();
        Empresa empresa = logicService.buscarEmpresaPorEmail(email);

        if (empresa == null) {
            return ResponseEntity.notFound().build();
        }

        List<Puesto> puestos = logicService.findPuestosPorEmpresa(email);

        List<Map<String, Object>> resultado = puestos.stream()
                .map(this::convertirPuesto)
                .toList();

        return ResponseEntity.ok(resultado);
    }

    /**
     * Obtener detalles de un puesto específico
     */
    @GetMapping("/puestos/{id}")
    public ResponseEntity<Map<String, Object>> obtenerPuesto(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        String emailEmpresa = authentication.getName();
        Puesto puesto = puestoRepository.findById(id).orElse(null);

        if (puesto == null) {
            return ResponseEntity.notFound().build();
        }

        // Verificar que la empresa sea dueña del puesto
        if (!puesto.getEmailEmpresa().getEmail().equals(emailEmpresa)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(convertirPuesto(puesto));
    }

    /**
     * Desactivar un puesto
     */
    @DeleteMapping("/puestos/{id}")
    public ResponseEntity<Map<String, Object>> desactivarPuesto(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        String emailEmpresa = authentication.getName();
        Puesto puesto = puestoRepository.findById(id).orElse(null);

        if (puesto == null) {
            return ResponseEntity.notFound().build();
        }

        // Verificar que la empresa sea dueña del puesto
        if (!puesto.getEmailEmpresa().getEmail().equals(emailEmpresa)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        logicService.desactivarPuesto(id);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Puesto desactivado correctamente."
        ));
    }

    /**
     * Buscar candidatos para un puesto específico
     */
    @GetMapping("/puestos/{id}/candidatos")
    public ResponseEntity<List<Map<String, Object>>> buscarCandidatos(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        String emailEmpresa = authentication.getName();
        Puesto puesto = puestoRepository.findById(id).orElse(null);

        if (puesto == null) {
            return ResponseEntity.notFound().build();
        }

        // Verificar que la empresa sea dueña del puesto
        if (!puesto.getEmailEmpresa().getEmail().equals(emailEmpresa)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        var candidatos = logicService.buscarCandidatosParaPuesto(id);

        List<Map<String, Object>> resultado = candidatos.stream()
                .map(match -> {
                    Map<String, Object> map = new java.util.LinkedHashMap<>();
                    map.put("cedula", match.getOferente().getCedula());
                    map.put("nombre", match.getOferente().getNombre());
                    map.put("apellido", match.getOferente().getApellido());
                    map.put("email", match.getOferente().getEmail());
                    map.put("porcentaje", match.getPorcentaje());
                    map.put("coincidencias", match.getCoincidencias());
                    return map;
                })
                .toList();

        return ResponseEntity.ok(resultado);
    }

    // Helper methods
    private Map<String, Object> convertirPuesto(Puesto puesto) {
        return Map.of(
                "id", puesto.getId(),
                "descripcion", puesto.getDescripcion(),
                "salarioOfrecido", puesto.getSalarioOfrecido(),
                "moneda", puesto.getMoneda(),
                "tipoPublicacion", puesto.getTipoPublicacion(),
                "activo", puesto.getActivo(),
                "fechaPublicacion", puesto.getFechaPublicacion(),
                "caracteristicas", puesto.getPuestoCaracteristicas().stream()
                        .map(pc -> Map.of(
                                "id", pc.getIdCaracteristica().getId(),
                                "nombre", pc.getIdCaracteristica().getNombre(),
                                "nivelDeseado", pc.getNivelDeseado()
                        ))
                        .toList()
        );
    }
}