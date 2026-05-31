package com.example.proyecto1programacion4.presentation.api;

import com.example.proyecto1programacion4.data.CaracteristicaRepository;
import com.example.proyecto1programacion4.data.OferenteCaracteristicaRepository;
import com.example.proyecto1programacion4.data.OferenteRepository;
import com.example.proyecto1programacion4.data.PuestoRepository;
import com.example.proyecto1programacion4.logic.LogicService;
import com.example.proyecto1programacion4.logic.Oferente;
import com.example.proyecto1programacion4.logic.OferenteCaracteristica;
import com.example.proyecto1programacion4.logic.Caracteristica;
import com.example.proyecto1programacion4.logic.Puesto;
import com.example.proyecto1programacion4.logic.PuestoCaracteristica;
import com.example.proyecto1programacion4.presentation.api.dto.HabilidadRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/oferente")
public class OferenteRestController {

    private final LogicService logicService;
    private final OferenteRepository oferenteRepository;
    private final OferenteCaracteristicaRepository oferenteCaracteristicaRepository;
    private final CaracteristicaRepository caracRepo;
    private final PuestoRepository puestoRepository;

    private final Path uploadDir = Paths.get("C:\\Users\\Kevin\\Desktop\\Progra 4, 2026\\Projecto2\\Proyecto2Progra4\\uploads");

    public OferenteRestController(
            LogicService logicService,
            OferenteRepository oferenteRepository,
            OferenteCaracteristicaRepository oferenteCaracteristicaRepository,
            CaracteristicaRepository caracRepo,
            PuestoRepository puestoRepository
    ) {
        this.logicService = logicService;
        this.oferenteRepository = oferenteRepository;
        this.oferenteCaracteristicaRepository = oferenteCaracteristicaRepository;
        this.caracRepo = caracRepo;
        this.puestoRepository = puestoRepository;
    }

    /**
     * Obtener el perfil del oferente autenticado
     */
    @GetMapping("/perfil")
    public ResponseEntity<Map<String, Object>> obtenerPerfil(Authentication authentication) {
        String email = authentication.getName();
        Oferente oferente = logicService.buscarOferentePorEmail(email);

        if (oferente == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("email", valorSeguro(oferente.getEmail()));
        response.put("cedula", valorSeguro(oferente.getCedula()));
        response.put("nombre", valorSeguro(oferente.getNombre()));
        response.put("apellido", valorSeguro(oferente.getApellido()));
        response.put("nacionalidad", valorSeguro(oferente.getNacionalidad()));
        response.put("telefono", valorSeguro(oferente.getTelefono()));
        response.put("residencia", valorSeguro(oferente.getResidencia()));
        response.put("curriculoPath", valorSeguro(oferente.getCurriculoPath()));
        response.put("tieneCV", oferente.getCurriculoPath() != null && !oferente.getCurriculoPath().isBlank());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/caracteristicas")
    public ResponseEntity<Map<String, Object>> listarCaracteristicas(@RequestParam(required = false) Integer padreId) {
        Caracteristica padre = padreId == null ? null : caracRepo.findById(padreId).orElse(null);

        if (padreId != null && padre == null) {
            return ResponseEntity.notFound().build();
        }

        List<Caracteristica> lista = (padre == null)
                ? caracRepo.findByIdPadreIsNull()
                : caracRepo.findByIdPadre(padre);

        List<Map<String, Object>> resultado = lista.stream()
                .map(caracteristica -> {
                    Map<String, Object> item = new java.util.LinkedHashMap<>();
                    item.put("id", caracteristica.getId());
                    item.put("nombre", caracteristica.getNombre());
                    item.put("idPadre", caracteristica.getIdPadre() != null ? caracteristica.getIdPadre().getId() : null);
                    item.put("tieneHijos", caracRepo.existsByIdPadre(caracteristica));
                    return item;
                })
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("lista", resultado);
        return ResponseEntity.ok(response);
    }

    /**
     * Listar habilidades del oferente autenticado
     */
    @GetMapping("/habilidades")
    public ResponseEntity<List<Map<String, Object>>> listarHabilidades(Authentication authentication) {
        String email = authentication.getName();
        Oferente oferente = logicService.buscarOferentePorEmail(email);

        if (oferente == null) {
            return ResponseEntity.notFound().build();
        }

        List<OferenteCaracteristica> habilidades = logicService.listarCaracteristicasOferente(oferente.getCedula());

        List<Map<String, Object>> resultado = habilidades.stream()
                .map(h -> {
                    Map<String, Object> map = new java.util.LinkedHashMap<>();
                    map.put("id", h.getId());
                    map.put("caracteristicaId", h.getIdCaracteristica().getId());
                    map.put("caracteristicaNombre", h.getIdCaracteristica().getNombre());
                    map.put("nivel", h.getNivel());
                    return map;
                })
                .toList();

        return ResponseEntity.ok(resultado);
    }

    /**
     * Guardar o actualizar habilidades del oferente
     */
    @PostMapping("/habilidades")
    public ResponseEntity<Map<String, Object>> guardarHabilidades(
            Authentication authentication,
            @RequestBody HabilidadRequest request
    ) {
        try {
            String email = authentication.getName();
            Oferente oferente = logicService.buscarOferentePorEmail(email);

            if (oferente == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "mensaje", "Oferente no encontrado."
                ));
            }

            // Eliminar habilidades antiguas (opcional, si quieres reemplazarlas)
            // ofertaRepository.deleteAll(listarHabilidades(oferente.getCedula()));

            // Guardar las nuevas habilidades
            if (request.getHabilidades() != null && !request.getHabilidades().isEmpty()) {
                for (HabilidadRequest.HabilidadItem habilidad : request.getHabilidades()) {
                    OferenteCaracteristica oc = oferenteCaracteristicaRepository
                            .findByCedulaOferenteEmailAndIdCaracteristicaId(email, habilidad.getCaracteristicaId())
                            .orElseGet(OferenteCaracteristica::new);
                    oc.setCedulaOferente(oferente);
                    oc.setNivel(habilidad.getNivel());
                    logicService.guardarOferenteCaracteristica(oc, habilidad.getCaracteristicaId());
                }
            }

            return ResponseEntity.ok(Map.of(
                    "mensaje", "Habilidades guardadas correctamente."
            ));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "mensaje", ex.getMessage()
            ));
        }
    }

    /**
     * Subir CV en formato PDF
     */
    @PostMapping("/cv/subir")
    public ResponseEntity<Map<String, Object>> subirCV(
            Authentication authentication,
            @RequestParam("archivo") MultipartFile archivo
    ) {
        try {
            if (archivo == null || archivo.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "mensaje", "Debe seleccionar un archivo PDF."
                ));
            }

            String nombreOriginal = archivo.getOriginalFilename() != null ? archivo.getOriginalFilename() : "";
            String contentType = archivo.getContentType() != null ? archivo.getContentType() : "";
            boolean esPdf = MediaType.APPLICATION_PDF_VALUE.equalsIgnoreCase(contentType)
                    || nombreOriginal.toLowerCase(Locale.ROOT).endsWith(".pdf");

            if (!esPdf) {
                return ResponseEntity.badRequest().body(Map.of(
                        "mensaje", "Solo se permiten archivos PDF."
                ));
            }

            String email = authentication.getName();
            Oferente oferente = logicService.buscarOferentePorEmail(email);

            if (oferente == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "mensaje", "Oferente no encontrado."
                ));
            }

            // Crear directorio si no existe
            Files.createDirectories(uploadDir);

            // Generar nombre único para el archivo
            String identificador = (oferente.getEmail() != null ? oferente.getEmail() : oferente.getCedula())
                    .replaceAll("[^a-zA-Z0-9._-]", "_");
            String nombreArchivo = identificador + "_cv_" + UUID.randomUUID() + ".pdf";
            Path rutaArchivo = uploadDir.resolve(nombreArchivo);

            // Guardar archivo
            archivo.transferTo(rutaArchivo.toFile());

            // Actualizar el path en la base de datos
            oferente.setCurriculoPath(nombreArchivo);
            logicService.guardarOferente(oferente);

            return ResponseEntity.ok(Map.of(
                    "mensaje", "CV subido correctamente.",
                    "nombreArchivo", nombreArchivo
            ));
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "mensaje", "Error al subir el archivo: " + ex.getMessage()
            ));
        }
    }

    private String valorSeguro(String valor) {
        return valor != null ? valor : "";
    }

    /**
     * Descargar CV del oferente
     */
    @GetMapping("/cv/descargar/{cedula}")
    public ResponseEntity<Resource> descargarCV(@PathVariable String cedula) {
        try {
            Resource resource = logicService.obtenerArchivoCV(cedula);

            if (resource == null || !resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"cv_" + cedula + ".pdf\"")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                    .body(resource);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/cv/actual")
    public ResponseEntity<?> descargarCVActual(Authentication authentication) {
        try {
            String email = authentication.getName();
            Oferente oferente = logicService.buscarOferentePorEmail(email);

            if (oferente == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                        "mensaje", "Oferente no encontrado."
                ));
            }

            Resource resource = logicService.obtenerArchivoCVDeOferente(oferente);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + oferente.getCurriculoPath() + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                    .body(resource);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "mensaje", ex.getMessage()
            ));
        }
    }

    /**
     * Obtener detalle completo de un oferente (para empresa)
     */
    @GetMapping("/detalles/{cedula}")
    public ResponseEntity<Map<String, Object>> obtenerDetalles(@PathVariable String cedula) {
        Oferente oferente = logicService.buscarOferentePorCedula(cedula);

        if (oferente == null) {
            return ResponseEntity.notFound().build();
        }

        List<OferenteCaracteristica> habilidades = logicService.listarCaracteristicasOferente(cedula);

        List<Map<String, Object>> habilidadesFormato = habilidades.stream()
                .map(h -> {
                    Map<String, Object> map = new java.util.LinkedHashMap<>();
                    map.put("caracteristicaNombre", h.getIdCaracteristica().getNombre());
                    map.put("nivel", h.getNivel());
                    return map;
                })
                .toList();

        return ResponseEntity.ok(Map.of(
                "cedula", oferente.getCedula(),
                "nombre", oferente.getNombre(),
                "apellido", oferente.getApellido(),
                "email", oferente.getEmail(),
                "nacionalidad", oferente.getNacionalidad(),
                "telefono", oferente.getTelefono(),
                "residencia", oferente.getResidencia(),
                "habilidades", habilidadesFormato,
                "tieneCV", oferente.getCurriculoPath() != null && !oferente.getCurriculoPath().isEmpty()
        ));

    }

    @GetMapping("/puestos/privados/recientes")
    public ResponseEntity<List<Map<String, Object>>> listarPuestosPrivadosRecientes() {
        List<Puesto> puestos = puestoRepository
                .findTop3ByTipoPublicacionIgnoreCaseAndActivoTrueOrderByFechaPublicacionDesc("PRIVADA");

        return ResponseEntity.ok(puestos.stream()
                .map(this::convertirPuesto)
                .toList());
    }

    @GetMapping("/puestos/recientes")
    public ResponseEntity<List<Map<String, Object>>> listarPuestosRecientesParaOferente() {
        List<Puesto> publicos = puestoRepository
                .findTop3ByTipoPublicacionIgnoreCaseAndActivoTrueOrderByFechaPublicacionDesc("PUBLICA");
        List<Puesto> privados = puestoRepository
                .findTop3ByTipoPublicacionIgnoreCaseAndActivoTrueOrderByFechaPublicacionDesc("PRIVADA");

        List<Map<String, Object>> resultado = new java.util.ArrayList<>();
        resultado.addAll(publicos.stream().map(this::convertirPuesto).toList());
        resultado.addAll(privados.stream().map(this::convertirPuesto).toList());

        return ResponseEntity.ok(resultado);
    }

    /**
     * BUSCADOR GLOBAL PARA LA EMPRESA:
     * Obtiene todos los oferentes del sistema inyectándoles sus respectivas habilidades.
     * Ruta final: GET http://localhost:8080/api/oferente/busqueda-global
     */
    @GetMapping("/busqueda-global")
    public ResponseEntity<List<Map<String, Object>>> obtenerOferentesParaBuscador() {
        // 1. Traer todos los oferentes base de la base de datos
        List<Oferente> todosLosOferentes = oferenteRepository.findAll();

        // 2. Armar la estructura con sus habilidades
        List<Map<String, Object>> resultado = todosLosOferentes.stream().map(oferente -> {
            Map<String, Object> map = new java.util.LinkedHashMap<>();
            map.put("cedula", oferente.getCedula());
            map.put("nombre", oferente.getNombre());
            map.put("apellido", oferente.getApellido());
            map.put("email", oferente.getEmail());
            map.put("residencia", oferente.getResidencia());

            // Buscar las habilidades reales asociadas a la cédula de este oferente
            List<OferenteCaracteristica> caracteristicas = logicService.listarCaracteristicasOferente(oferente.getCedula());

            // Mapear la lista de habilidades al formato legible por el Frontend
            List<String> habilidadesNombres = caracteristicas.stream()
                    .map(h -> h.getIdCaracteristica().getNombre())
                    .toList();

            map.put("habilidades", habilidadesNombres);
            return map;
        }).toList();

        return ResponseEntity.ok(resultado);
    }

    private Map<String, Object> convertirPuesto(Puesto puesto) {
        Map<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id", puesto.getId());
        map.put("descripcion", puesto.getDescripcion());
        map.put("salarioOfrecido", puesto.getSalarioOfrecido());
        map.put("moneda", puesto.getMoneda());
        map.put("tipoPublicacion", puesto.getTipoPublicacion());
        map.put("fechaPublicacion", puesto.getFechaPublicacion());
        map.put("empresa", puesto.getEmailEmpresa() != null ? puesto.getEmailEmpresa().getNombre() : "");
        map.put("caracteristicas", puesto.getPuestoCaracteristicas()
                .stream()
                .map(this::convertirCaracteristicaPuesto)
                .toList());
        return map;
    }

    private Map<String, Object> convertirCaracteristicaPuesto(PuestoCaracteristica puestoCaracteristica) {
        Map<String, Object> map = new java.util.LinkedHashMap<>();
        map.put("id", puestoCaracteristica.getIdCaracteristica() != null
                ? puestoCaracteristica.getIdCaracteristica().getId()
                : null);
        map.put("nombre", puestoCaracteristica.getIdCaracteristica() != null
                ? puestoCaracteristica.getIdCaracteristica().getNombre()
                : "");
        map.put("nivelDeseado", puestoCaracteristica.getNivelDeseado());
        return map;
    }
}
