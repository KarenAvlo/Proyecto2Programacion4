package com.example.proyecto1programacion4.presentation.api;

import com.example.proyecto1programacion4.data.OferenteCaracteristicaRepository;
import com.example.proyecto1programacion4.data.OferenteRepository;
import com.example.proyecto1programacion4.logic.LogicService;
import com.example.proyecto1programacion4.logic.Oferente;
import com.example.proyecto1programacion4.logic.OferenteCaracteristica;
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
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/oferente")
public class OferenteRestController {

    private final LogicService logicService;
    private final OferenteRepository oferenteRepository;
    private final OferenteCaracteristicaRepository oferenteCaracteristicaRepository;

    private final Path uploadDir = Paths.get("./uploads");

    public OferenteRestController(
            LogicService logicService,
            OferenteRepository oferenteRepository,
            OferenteCaracteristicaRepository oferenteCaracteristicaRepository
    ) {
        this.logicService = logicService;
        this.oferenteRepository = oferenteRepository;
        this.oferenteCaracteristicaRepository = oferenteCaracteristicaRepository;
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

        return ResponseEntity.ok(Map.of(
                "email", oferente.getEmail(),
                "cedula", oferente.getCedula(),
                "nombre", oferente.getNombre(),
                "apellido", oferente.getApellido(),
                "nacionalidad", oferente.getNacionalidad(),
                "telefono", oferente.getTelefono(),
                "residencia", oferente.getResidencia(),
                "curriculoPath", oferente.getCurriculoPath() != null ? oferente.getCurriculoPath() : ""
        ));
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
                    OferenteCaracteristica oc = new OferenteCaracteristica();
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
            // Validar que sea PDF
            if (!archivo.getContentType().equals("application/pdf")) {
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
            String nombreArchivo = "cv_" + oferente.getCedula() + "_" + UUID.randomUUID() + ".pdf";
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

    /**
     * Descargar CV del oferente
     */
    @GetMapping("/cv/descargar/{cedula}")
    public ResponseEntity<Resource> descargarCV(@PathVariable String cedula) {
        try {
            Resource resource = logicService.obtenerArchivoCV(cedula);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"cv_" + cedula + ".pdf\"")
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                    .body(resource);
        } catch (Exception ex) {
            return ResponseEntity.notFound().build();
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
}
