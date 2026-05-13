package com.example.proyecto1programacion4.presentation.api;

import com.example.proyecto1programacion4.data.PuestoRepository;
import com.example.proyecto1programacion4.logic.Empresa;
import com.example.proyecto1programacion4.logic.LogicService;
import com.example.proyecto1programacion4.logic.Puesto;
import com.example.proyecto1programacion4.logic.PuestoCaracteristica;
import com.example.proyecto1programacion4.presentation.api.dto.EmpresaRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.proyecto1programacion4.logic.Oferente;
import com.example.proyecto1programacion4.presentation.api.dto.OferenteRequest;
import java.util.List;
import java.util.Map;

@RestController
public class PublicRestController {

    private final PuestoRepository puestoRepository;
    private final LogicService logicService;

    public PublicRestController(PuestoRepository puestoRepository, LogicService logicService) {
        this.puestoRepository = puestoRepository;
        this.logicService = logicService;
    }

    @GetMapping("/api/public/ping")
    public Map<String, String> ping() {
        return Map.of(
                "mensaje", "Backend REST funcionando correctamente"
        );
    }

    @PostMapping("/api/public/empresas/registro")
    public ResponseEntity<Map<String, Object>> registrarEmpresa(
            @RequestBody EmpresaRequest request
    ) {
        try {
            Empresa empresa = new Empresa();
            empresa.setEmail(request.getEmail());
            empresa.setClave(request.getClave());
            empresa.setNombre(request.getNombre());
            empresa.setLocalizacion(request.getLocalizacion());
            empresa.setTelefono(request.getTelefono());
            empresa.setDescripcion(request.getDescripcion());

            logicService.registrarEmpresa(empresa);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Empresa registrada correctamente. Queda pendiente de aprobación."
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "mensaje", ex.getMessage()
            ));
        }
    }

    @PostMapping("/api/public/oferentes/registro")
    public ResponseEntity<Map<String, Object>> registrarOferente(
            @RequestBody OferenteRequest request
    ) {
        try {
            Oferente oferente = new Oferente();
            oferente.setEmail(request.getEmail());
            oferente.setClave(request.getClave());
            oferente.setCedula(request.getCedula());
            oferente.setNombre(request.getNombre());
            oferente.setApellido(request.getApellido());
            oferente.setNacionalidad(request.getNacionalidad());
            oferente.setTelefono(request.getTelefono());
            oferente.setResidencia(request.getResidencia());

            logicService.registrarOferente(oferente);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Oferente registrado correctamente. Queda pendiente de aprobación."
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "mensaje", ex.getMessage()
            ));
        }
    }


    @GetMapping("/api/public/puestos/recientes")
    public List<Map<String, Object>> puestosRecientes() {
        List<Puesto> puestos = puestoRepository
                .findTop5ByTipoPublicacionIgnoreCaseAndActivoTrueOrderByFechaPublicacionDesc("PUBLICA");

        return puestos.stream()
                .map(this::convertirPuesto)
                .toList();
    }

    @GetMapping("/api/public/puestos/buscar")
    public List<Map<String, Object>> buscarPuestos(
            @RequestParam(required = false) List<Integer> caracteristicaIds
    ) {
        List<Puesto> puestos;

        if (caracteristicaIds == null || caracteristicaIds.isEmpty()) {
            puestos = puestoRepository
                    .findByTipoPublicacionIgnoreCaseAndActivoTrueOrderByFechaPublicacionDesc("PUBLICA");
        } else {
            puestos = puestoRepository.buscarPublicosPorCaracteristicas("PUBLICA", caracteristicaIds);
        }

        return puestos.stream()
                .map(this::convertirPuesto)
                .toList();
    }

    private Map<String, Object> convertirPuesto(Puesto puesto) {
        return Map.of(
                "id", puesto.getId(),
                "descripcion", puesto.getDescripcion(),
                "salarioOfrecido", puesto.getSalarioOfrecido(),
                "moneda", puesto.getMoneda(),
                "tipoPublicacion", puesto.getTipoPublicacion(),
                "fechaPublicacion", puesto.getFechaPublicacion(),
                "empresa", puesto.getEmailEmpresa() != null ? puesto.getEmailEmpresa().getNombre() : "",
                "caracteristicas", convertirCaracteristicas(puesto)
        );
    }

    private List<Map<String, Object>> convertirCaracteristicas(Puesto puesto) {
        return puesto.getPuestoCaracteristicas()
                .stream()
                .map(this::convertirCaracteristica)
                .toList();
    }

    private Map<String, Object> convertirCaracteristica(PuestoCaracteristica puestoCaracteristica) {
        return Map.of(
                "id", puestoCaracteristica.getIdCaracteristica() != null
                        ? puestoCaracteristica.getIdCaracteristica().getId()
                        : null,
                "nombre", puestoCaracteristica.getIdCaracteristica() != null
                        ? puestoCaracteristica.getIdCaracteristica().getNombre()
                        : "",
                "nivelDeseado", puestoCaracteristica.getNivelDeseado()
        );
    }
}