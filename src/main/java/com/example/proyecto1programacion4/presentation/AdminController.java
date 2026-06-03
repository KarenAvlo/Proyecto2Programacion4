package com.example.proyecto1programacion4.presentation;

import com.example.proyecto1programacion4.logic.LogicService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final LogicService logicService;

    public AdminController(LogicService logicService) {
        this.logicService = logicService;
    }

    @GetMapping("/reporte/mensual")
    public ResponseEntity<byte[]> descargarReporteMensual(@RequestParam("mes") int mes) {
        try {
            byte[] pdfBytes = logicService.generarReporteEmpresasPDF(mes);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("inline", "Reporte_Mes_" + mes + ".pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
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
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
