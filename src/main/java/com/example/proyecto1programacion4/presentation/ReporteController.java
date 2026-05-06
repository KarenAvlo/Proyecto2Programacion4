package com.example.proyecto1programacion4.presentation;

import com.example.proyecto1programacion4.logic.LogicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;


@Controller
@RequestMapping("/admin/reportes")
public class ReporteController {

    @Autowired
    private LogicService service;

    @GetMapping("/pagina")
    public String mostrarPaginaReportes(){
        return "admin_reportes";
    }

    @GetMapping("/ReporteEmpresas")
    public ResponseEntity<byte[]> descargarReporteEmpresas(@RequestParam("mes") int mes) {
        try {
            // Llamamos al Service pasando el mes
            byte[] pdfBytes = service.generarReporteEmpresasPDF(mes);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                    // "inline" para abrir en pestaña, "attachment" si quieres descarga directa
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=reporte_puestos_mes_" + mes + ".pdf")
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/Reporteferentes")
    public ResponseEntity<byte[]> descargarReporteOferentes() {
        try {
            byte[] pdfBytes = service.generarReporteOferentesPDF();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=reporte_general_oferentes.pdf")
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}
