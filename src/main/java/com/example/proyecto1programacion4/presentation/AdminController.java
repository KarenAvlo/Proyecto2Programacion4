package com.example.proyecto1programacion4.presentation;



import com.example.proyecto1programacion4.data.CaracteristicaRepository;
import com.example.proyecto1programacion4.logic.Caracteristica;
import com.example.proyecto1programacion4.logic.LogicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private LogicService logicService; // Tu clase de lógica/servicio

    @Autowired
    private CaracteristicaRepository caracRepo;

    @GetMapping("/dashboard")
    public String dashboard(Authentication authentication, Model model) {
        // Si authentication es null, ponemos un valor por defecto o redirigimos
        String email = (authentication != null) ? authentication.getName() : "Admin";
        model.addAttribute("correoUsuario", email);
        return "dashboard_admi";
    }

    @GetMapping("/empresas-pendientes")
    public String listarEmpresas(Authentication authentication, Model model) {
        //  Cargamos la lista de empresas
        model.addAttribute("empresas", logicService.findEmpresasPendientes());

        //  Cargamos el correo para el navbar
        String email = (authentication != null) ? authentication.getName() : "Admin";
        model.addAttribute("correoUsuario", email);

        return "empresas_pendientes";
    }

    @GetMapping("/oferentes-pendientes")
    public String listarOferentes(Authentication authentication, Model model) {
        // Enviamos la lista de OFERENTES
        model.addAttribute("oferentes", logicService.findOferentesPendientes());

        // Enviamos el correo para el nav
        model.addAttribute("correoUsuario", authentication.getName());

        // Retornamos la vista
        return "oferentes_pendientes";
    }

    @PostMapping("/autorizar/{email}")
    public String autorizar(@PathVariable String email, @RequestParam String tipo) {
        logicService.aprobarUsuario(email);
        return "redirect:/admin/" + (tipo.equals("EMPRESA") ? "empresas" : "oferentes") + "-pendientes";
    }

    @GetMapping("/caracteristicas")
    public String listarCaracteristicas(@RequestParam(name = "padreId", required = false) Integer padreId, Model model, Authentication auth) {
        model.addAttribute("correoUsuario", auth.getName());
        model.addAttribute("raices", caracRepo.findByIdPadreIsNull());

        if (padreId == null) {
            model.addAttribute("lista", caracRepo.findByIdPadreIsNull());
            model.addAttribute("padre", null);
        } else {
            Caracteristica padreObj = caracRepo.findById(padreId).orElse(null);
            model.addAttribute("padre", padreObj);
            model.addAttribute("lista", caracRepo.findByIdPadre(padreObj));
        }

        return "admi_caracteristicas";
    }



    @GetMapping("/caracteristicas/eliminar/{id}")
    public String eliminar(@PathVariable Integer id) {
        caracRepo.deleteById(id);
        return "redirect:/admin/caracteristicas";
    }

    @PostMapping("/caracteristicas/save")
    public String guardarCaracteristica(@RequestParam("nombre") String nombre,
                                        @RequestParam(value = "padreId", required = false) Integer padreId) {
        Caracteristica nueva = new Caracteristica();
        nueva.setNombre(nombre);

        if (padreId != null) {
            // Buscamos el objeto padre para establecer la relación jerárquica
            Caracteristica padre = caracRepo.findById(padreId).orElse(null);
            nueva.setIdPadre(padre);
        }

        caracRepo.save(nueva);

        // Redirigimos a la misma página para ver los cambios
        return "redirect:/admin/caracteristicas" + (padreId != null ? "?padreId=" + padreId : "");
    }

    @ModelAttribute
    public void addAttributes(org.springframework.security.core.Authentication authentication, org.springframework.ui.Model model) {
        if (authentication != null) {
            model.addAttribute("correoUsuario", authentication.getName());
        }
    }

    @GetMapping("/reportes/puestos-mes")
    public ResponseEntity<byte[]> reportePuestosPorMes(@RequestParam("mes") int mes) {
        try {
            // Llamamos al servicio para generar el contenido del PDF
            byte[] pdfContenido = logicService.generarReporteEmpresasPDF(mes);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "reporte_puestos_mes_" + mes + ".pdf");

            return new ResponseEntity<>(pdfContenido, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/reporte/mensual")
    public ResponseEntity<byte[]> descargarReporteMensual(@RequestParam("mes") int mes) {
        try {
            byte[] pdfBytes = logicService.generarReporteEmpresasPDF(mes);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            // "inline" para abrir en el navegador, "attachment" para descargar directo
            headers.setContentDispositionFormData("inline", "Reporte_Mes_" + mes + ".pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/reportes")
    public String paginaReportes(Authentication authentication, Model model) {
        // Pasamos el correo para el navbar como en los otros métodos
        String email = (authentication != null) ? authentication.getName() : "Admin";
        model.addAttribute("correoUsuario", email);

        return "admin_reportes"; // Este es el nombre de tu archivo HTML
    }


    @GetMapping("/reportes/exportar/oferentes")
    public ResponseEntity<byte[]> descargarReporteOferentes() {
        try {

            byte[] pdfBytes = logicService.generarReporteOferentesPDF();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "Reporte_Estadistico_Oferentes.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
