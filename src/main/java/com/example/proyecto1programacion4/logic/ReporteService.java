package com.example.proyecto1programacion4.logic;

import com.example.proyecto1programacion4.data.OferenteCaracteristicaRepository;
import com.example.proyecto1programacion4.data.OferenteRepository;
import com.example.proyecto1programacion4.data.PuestoCaracteristicaRepository;
import com.example.proyecto1programacion4.data.PuestoRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// --- LIBRERÍA PDF (OpenPDF / iText) ---
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;

import java.io.IOException;
import java.util.List;


@Service
public class ReporteService {
    @Autowired
    private PuestoRepository puestoRepo;
    @Autowired
    private PuestoCaracteristicaRepository puestoCaracRepo;
    @Autowired
    private OferenteRepository oferenteRepo;
    @Autowired
    private OferenteCaracteristicaRepository oferenteCaracRepo;

    public void generarReporteEmpresas(HttpServletResponse response, int mes) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        document.add(new Paragraph("REPORTE DE PUBLIACIONES - MES: " + mes));

        List<Puesto> puestos = puestoRepo.findByMes(mes);

        for (Puesto p : puestos) {
            document.add(new Paragraph("\nEmpresa: " + p.getEmailEmpresa().getNombre()));
            document.add(new Paragraph("Salario: " + p.getSalarioOfrecido() + " Moneda: " + p.getMoneda() +
                    " | Fecha de Publicacion: " + p.getFechaPublicacion()));
            document.add(new Paragraph("Tipo: " + p.getTipoPublicacion()));

            List<PuestoCaracteristica> caracs = puestoCaracRepo.findByIdPuesto(p);
            PdfPTable table = new PdfPTable(2);
            table.addCell("Característica");
            table.addCell("Nivel Deseado");

            for (PuestoCaracteristica pc : caracs) {
                table.addCell(pc.getIdCaracteristica().getNombre());
                table.addCell(pc.getNivelDeseado().toString());
            }
            document.add(table);
        }
        document.close();
    }

    public void generarReporteOferentes(HttpServletResponse response) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        document.add(new Paragraph("REPORTE GENERAL DE OFERENTES\n\n"));

        List<Oferente> oferentes = oferenteRepo.findAll();
        int totalOferentes = oferentes.size();
        int totalHabilidades = 0;
        double sumaNiveles = 0;

        for (Oferente o : oferentes) {
            document.add(new Paragraph("Oferente: " + o.getNombre() + " " + o.getApellido()));

            PdfPTable table = new PdfPTable(2);
            table.addCell("Habilidad");
            table.addCell("Nivel");
            List<OferenteCaracteristica> habilidades = oferenteCaracRepo.findByCedulaOferente(o.getCedula());

            for (OferenteCaracteristica oh : habilidades) {
                table.addCell(oh.getIdCaracteristica().getNombre());
                table.addCell(String.valueOf(oh.getNivel()));

                sumaNiveles += oh.getNivel();
                totalHabilidades++;
            }
            document.add(table);
            document.add(new Paragraph("\n"));
        }
        //Calcula los promedios
        double promedioHabilidadesPorPersona = totalOferentes > 0 ? (double) totalHabilidades / totalOferentes : 0;
        double promedioNivelGlobal = totalHabilidades > 0 ? sumaNiveles / totalHabilidades : 0;

        document.add(new Paragraph("---------------------------------------"));
        document.add(new Paragraph("Resumen Estadístico:"));
        document.add(new Paragraph("Total Oferentes: " + totalOferentes));
        document.add(new Paragraph("Promedio Habilidades por Oferente: " + String.format("%.2f", promedioHabilidadesPorPersona)));
        document.add(new Paragraph("Nivel Promedio General: " + String.format("%.2f", promedioNivelGlobal)));
        document.close();
    }

}
