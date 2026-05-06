package com.example.proyecto1programacion4.presentation;

import com.example.proyecto1programacion4.logic.LogicService;
import com.example.proyecto1programacion4.logic.OferenteCaracteristica;
import com.example.proyecto1programacion4.logic.Oferente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
@RequestMapping("/presentation/oferente")
public class OferenteController {

    @Autowired
    LogicService service;

    @GetMapping("/show")
    public String dashboard(Authentication auth, Model model) {
        // Validar que la autenticación no sea nula
        if (auth != null && auth.isAuthenticated()) {
            String email = auth.getName(); // El email del que se logueó
            Oferente oferente = service.buscarOferentePorEmail(email);

            //  Pasamos el objeto al modelo para que el HTML lo vea
            model.addAttribute("usuarioLogueado", oferente);
        }
        return "dashboard_oferente";
    }


    @GetMapping("/habilidades")
    public String verHabilidades(@RequestParam(value = "actualId", required = false) Integer actualId,
                                 Authentication auth,
                                 Model model) {
        String email = auth.getName();
        Oferente oferente = service.buscarOferentePorEmail(email);

        if (oferente != null) {
            // Cargar Habilidades ya registradas
            model.addAttribute("misHabilidades", service.listarCaracteristicasOferente(oferente.getCedula()));

            //  Lógica de Navegación y Subcategorías
            if (actualId != null) {
                model.addAttribute("subcategorias", service.listarSubcategoriasPorId(actualId));
                model.addAttribute("actual", service.buscarCaracteristicaPorId(actualId));

            } else {
                model.addAttribute("subcategorias", service.listaCaracteristicasPadre());
            }

            //  Datos para el Header (Evita que la página explote)
            model.addAttribute("nombreOferente", oferente.getNombre());
        }
        return "oferente_habilidades";
    }

    @PostMapping("/saveCaracteristica")
    public String saveCaracteristica(@ModelAttribute("nuevaHabilidad") OferenteCaracteristica nueva,
                                     @RequestParam("idCaracteristica") Integer idCarac,
                                     Authentication auth) {
        String email = auth.getName();
        Oferente oferente = service.buscarOferentePorEmail(email);

        if (oferente != null) {
            nueva.setCedulaOferente(oferente);
            // Llamamos al service pasando la característica seleccionada
            service.guardarOferenteCaracteristica(nueva, idCarac);
        }
        return "redirect:/presentation/oferente/habilidades";
    }

    @GetMapping("/mi-cv")
    public ResponseEntity<Resource> mostrarPaginaCV(Authentication auth, Model model, RedirectAttributes redirectAttributes) {
        try {
            Oferente oferente = service.buscarOferentePorEmail(auth.getName());

            if (oferente == null || oferente.getCurriculoPath() == null || oferente.getCurriculoPath().isEmpty()) {
                redirectAttributes.addFlashAttribute("mensajeError", "No tienes un currículum cargado actualmente.");
                return ResponseEntity.status(HttpStatus.FOUND).header(HttpHeaders.LOCATION, "/presentation/oferente/show").build();
            }

            Path path = Paths.get("uploads").resolve(oferente.getCurriculoPath()).toAbsolutePath();
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_PDF)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + oferente.getCurriculoPath() + "\"")
                        .body(resource);
            } else {
                redirectAttributes.addFlashAttribute("mensajeError", "El archivo físico no se encuentra en el servidor.");
            }

        } catch (MalformedURLException e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("mensajeError", "Error al intentar acceder al archivo.");
        }

        return ResponseEntity.status(HttpStatus.FOUND).header(HttpHeaders.LOCATION, "/presentation/oferente/show").build();
    }

    @PostMapping("/cvUpload")
    public String procesarCV(@RequestParam("archivo") MultipartFile file, Authentication auth) {
        if (!file.isEmpty() && file.getContentType().equals("application/pdf")) {
            try{
                String folder = "uploads/";
                String fileName = auth.getName()+"_cv.pdf";//se usa el email para que sea unico
                Path path= Paths.get(folder + fileName);
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());
                Oferente oferente = service.buscarOferentePorEmail(auth.getName());
                if (oferente != null) {
                    oferente.setCurriculoPath(fileName); // Guardamos solo el nombre o la ruta relativa
                    service.guardarOferente(oferente);
                }
            }catch (IOException e) {
                e.printStackTrace();
            }
        }
        return "redirect:/presentation/oferente/show";
    }
}
