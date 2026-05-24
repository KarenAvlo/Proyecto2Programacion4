package com.example.proyecto1programacion4.presentation.api;

import com.example.proyecto1programacion4.data.CaracteristicaRepository;
import com.example.proyecto1programacion4.data.OferenteRepository;
import com.example.proyecto1programacion4.data.PuestoRepository;
import com.example.proyecto1programacion4.logic.*;
import com.example.proyecto1programacion4.presentation.api.dto.PuestoRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empresa")
public class EmpresaRestController {

    private final LogicService logicService;
    private final PuestoRepository puestoRepository;
    private final CaracteristicaRepository caracteristicaRepository;
    private final OferenteRepository oferenteRepository; // <-- 1. Agregado el repositorio de candidatos

    // 2. Constructor actualizado para recibir e inyectar el repositorio
    public EmpresaRestController(
            LogicService logicService,
            PuestoRepository puestoRepository,
            CaracteristicaRepository caracteristicaRepository,
            OferenteRepository oferenteRepository
    ) {
        this.logicService = logicService;
        this.puestoRepository = puestoRepository;
        this.caracteristicaRepository = caracteristicaRepository;
        this.oferenteRepository = oferenteRepository;
    }

    /**
     * Obtener los datos de la empresa autenticada
     * (Mantiene tu mapeo real: usando localizacion, telefono, etc.)
     */
    @GetMapping("/perfil")
    public ResponseEntity<Map<String, Object>> obtenerPerfil(Authentication authentication) {
        String email = authentication.getName();
        Empresa empresa = logicService.buscarEmpresaPorEmail(email);
        if (empresa == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of(
                "nombre", empresa.getNombre(),
                "email", empresa.getEmail(),
                "telefono", empresa.getTelefono() != null ? empresa.getTelefono() : "",
                "localizacion", empresa.getLocalizacion() != null ? empresa.getLocalizacion() : "",
                "descripcion", empresa.getDescripcion() != null ? empresa.getDescripcion() : ""
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
     * ESTADÍSTICAS DEL DASHBOARD: Calcula los contadores reales de la empresa.
     * GET http://localhost:8080/api/empresa/dashboard-stats
     */
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasDashboard(Authentication authentication) {
        String email = authentication.getName();
        List<Puesto> puestos = logicService.findPuestosPorEmpresa(email);

        // Boolean.TRUE.equals maneja automáticamente el null y compara correctamente
        long puestosActivos = puestos.stream()
                .filter(p -> Boolean.TRUE.equals(p.getActivo()))
                .count();

        long puestosInactivos = puestos.size() - puestosActivos;

        return ResponseEntity.ok(Map.of(
                "totalPuestos", puestos.size(),
                "puestosActivos", puestosActivos,
                "puestosInactivos", puestosInactivos
        ));
    }

    /**
     * Listar puestos de la empresa autenticada
     */
    @GetMapping("/puestos")
    public ResponseEntity<List<Map<String, Object>>> obtenerPuestosPorEmpresa(Authentication authentication) {
        String email = authentication.getName();
        // Usamos el método que ya tenías en tu LogicService original
        List<Puesto> puestos = logicService.findPuestosPorEmpresa(email);

        List<Map<String, Object>> resultado = puestos.stream()
                .map(this::convertirPuesto) // Usa tu método helper existente
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

    /**
     * Obtener detalle completo de un oferente desde el perfil de empresa.
     */
    @GetMapping("/candidatos/{cedula}/detalle")
    public ResponseEntity<Map<String, Object>> obtenerDetalleCandidato(@PathVariable String cedula) {
        Oferente oferente = logicService.buscarOferentePorCedula(cedula);

        if (oferente == null) {
            return ResponseEntity.notFound().build();
        }

        List<OferenteCaracteristica> habilidades = logicService.listarCaracteristicasOferente(cedula);

        List<Map<String, Object>> habilidadesFormato = habilidades.stream()
                .map(h -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("caracteristicaNombre", h.getIdCaracteristica().getNombre());
                    map.put("nivel", h.getNivel());
                    return map;
                })
                .toList();

        Map<String, Object> resultado = new LinkedHashMap<>();
        resultado.put("cedula", oferente.getCedula());
        resultado.put("nombre", oferente.getNombre());
        resultado.put("apellido", oferente.getApellido());
        resultado.put("email", oferente.getEmail());
        resultado.put("nacionalidad", oferente.getNacionalidad());
        resultado.put("telefono", oferente.getTelefono());
        resultado.put("residencia", oferente.getResidencia());
        resultado.put("habilidades", habilidadesFormato);
        resultado.put("tieneCV", oferente.getCurriculoPath() != null && !oferente.getCurriculoPath().isEmpty());

        return ResponseEntity.ok(resultado);
    }

    /**
     * Abrir o descargar el CV de un candidato desde el perfil de empresa.
     */
    @GetMapping("/candidatos/{cedula}/cv")
    public ResponseEntity<Resource> obtenerCVCandidato(@PathVariable String cedula) {
        try {
            Resource resource = logicService.obtenerArchivoCV(cedula);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"cv_" + cedula + ".pdf\"")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                    .body(resource);
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
        }
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

    /**
     * BUSCADOR GLOBAL: Devuelve todos los oferentes de la BD con sus habilidades mapeadas.
     * GET http://localhost:8080/api/empresa/busqueda-global
     */
    @GetMapping("/busqueda-global")
    public ResponseEntity<List<Map<String, Object>>> obtenerOferentesGlobales() {
        // Obtenemos los candidatos usando el findAll nativo de tu OferenteRepository
        List<Oferente> todosLosOferentes = oferenteRepository.findAll();

        List<Map<String, Object>> resultado = todosLosOferentes.stream().map(oferente -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("cedula", oferente.getCedula());
            map.put("nombre", oferente.getNombre());
            map.put("apellido", oferente.getApellido());
            map.put("email", oferente.getEmail());
            map.put("residencia", oferente.getResidencia());

            // Buscamos las características asociadas a la cédula usando el método de tu LogicService
            List<OferenteCaracteristica> caracteristicas = logicService.listarCaracteristicasOferente(oferente.getCedula());

            // Convertimos la lista de objetos a solo un arreglo de Strings con los nombres de las habilidades
            List<String> habilidadesNombres = caracteristicas.stream()
                    .map(h -> h.getIdCaracteristica().getNombre())
                    .toList();

            map.put("habilidades", habilidadesNombres);
            return map;
        }).toList();

        return ResponseEntity.ok(resultado);
    }

    /**
     * CATÁLOGO DE CARACTERÍSTICAS: Devuelve el árbol completo ordenado alfabéticamente.
     * GET http://localhost:8080/api/empresa/catalogo-caracteristicas
     */
    @GetMapping("/catalogo-caracteristicas")
    public ResponseEntity<List<Map<String, Object>>> obtenerCatalogoHabilidades() {
        List<Map<String, Object>> todas = caracteristicaRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Caracteristica::getNombre))
                .map(c -> {
                    Map<String, Object> m = new java.util.LinkedHashMap<>();
                    m.put("id", c.getId());
                    m.put("nombre", c.getNombre());
                    // Extraemos el id del objeto recursivo idPadre mapeado en tu Caracteristica.java
                    m.put("padreId", c.getIdPadre() != null ? c.getIdPadre().getId() : null);
                    return m;
                }).toList();

        return ResponseEntity.ok(todas);
    }
}
