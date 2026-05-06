package com.example.proyecto1programacion4.logic;

import com.example.proyecto1programacion4.data.*;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;
import java.nio.file.Path;
import java.nio.file.Paths;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;
import java.awt.Color;

// Para el manejo de excepciones que pide el método
import java.net.MalformedURLException;
import java.util.stream.Collectors;

@Service
@Transactional
public class LogicService {

    @Autowired
    private OferenteRepository oferenteRepository;

    @Autowired
    private EmpresaRepository empresaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository; //para buscar email

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PuestoRepository puestoRepository;

    @Autowired
    private RequisitoRepository requisitoRepository;

    @Autowired
    private CaracteristicaRepository caracteristicaRepository;

    @Autowired
    private OferenteCaracteristicaRepository oferenteCaracteristicaRepository;

    @Autowired
    private PuestoCaracteristicaRepository puestoCaracteristicaRepository;


    private final Path root = Paths.get("./uploads");


    // --------------- INICIALIZACIÓN ----------------
    @PostConstruct
    public void init() {
        if (usuarioRepository.findByEmail("admin@bolsa.com") == null) {
            crearAdminInicial();
        }

        if (usuarioRepository.findByEmail("oferente@bolsa.com") == null) {
            crearOferenteInicial();
        }

        if (usuarioRepository.findByEmail("empresa@bolsa.com") == null) {
            crearEmpresaInicial();
        }

    }

    private void crearAdminInicial() {
        Usuario admin = new Usuario();
        admin.setEmail("admin@bolsa.com");
        admin.setClave(passwordEncoder.encode("123456"));
        admin.setTipo("ADMIN");
        admin.setEstado(true);
        usuarioRepository.save(admin);
    }

    private void crearOferenteInicial() {
        // Creamos el Usuario (Padre)
//        Usuario u = new Usuario();
        Oferente o = new Oferente();
        o.setEmail("oferente@bolsa.com");
        o.setClave(passwordEncoder.encode("123456"));
        o.setTipo("OFERENTE");
        o.setEstado(true); // Lo ponemos como aprobado para poder loguearnos ya
        //usuarioRepository.save(u);

        // Creamos el Oferente (Hijo)

        //o.setEmail(o.getEmail());
        o.setNombre("Juan");
        o.setApellido("Pérez");
        o.setCedula("1-1111-1111");
        o.setTelefono("8888-8888");
        // o.setEstado(true); // Si tu entidad Oferente tiene un campo estado, descomenta esto
        oferenteRepository.save(o);
    }

    private void crearEmpresaInicial() {
        // Creamos la Empresa (que según tu lógica hereda o tiene los campos de Usuario)
        Empresa e = new Empresa();
        e.setEmail("empresa@bolsa.com");
        e.setClave(passwordEncoder.encode("123456"));
        e.setTipo("EMPRESA");
        e.setEstado(true); // Aprobada para pruebas

        e.setNombre("Tech Solutions");
        e.setLocalizacion("San José, CR");
        e.setTelefono("7777-7777");
        e.setDescripcion("Empresa líder en tecnología");
        // Al usar herencia o @MapsId, solo necesitas guardar el repositorio de la Empresa
        empresaRepository.save(e);
    }

    // --------------- LÓGICA DE USUARIOS / ADMIN ----------------


    public void aprobarUsuario(String email) {
        Usuario u = usuarioRepository.findById(email).orElse(null);
        if (u != null) {
            u.setEstado(true);
            usuarioRepository.save(u);
        }
    }


// --------------- LÓGICA DE OFERENTES ----------------
    public void registrarOferente(Oferente o) throws Exception {
        if (usuarioRepository.existsById(o.getEmail())) {
            throw new Exception("El correo ya existe.");
        }

        // Configuramos los campos heredados de Usuario dentro del objeto Oferente
        o.setTipo("OFERENTE");
        o.setEstado(false);
        o.setClave(passwordEncoder.encode(o.getClave()));


        oferenteRepository.save(o);
    }

    public Oferente buscarOferentePorCedula(String cedula) {
        return oferenteRepository.findByCedula(cedula).orElse(null);
    }

    // --------------- LÓGICA DE EMPRESAS ----------------
    public void registrarEmpresa(Empresa e) throws Exception {
        if (usuarioRepository.existsById(e.getEmail())) {
            throw new Exception("El correo ya existe.");
        }
        e.setEmail(e.getEmail());
        e.setTipo("EMPRESA");
        e.setEstado(false);
        e.setClave(passwordEncoder.encode(e.getClave()));
        empresaRepository.save(e);
    }

    // --------------- DASHBOARD FILTROS ----------------
    public List<Usuario> findEmpresasPendientes() {
        return usuarioRepository.findByTipoAndEstado("EMPRESA", false);
    }

    public List<Usuario> findOferentesPendientes() {
        return usuarioRepository.findByTipoAndEstado("OFERENTE", false);
    }

    //================PUESTOS=============================

    // Busca la empresa para asignarla al puesto
    public Empresa buscarEmpresaPorEmail(String email) {
        return empresaRepository.findById(email).orElse(null);
    }

    // Guarda el puesto y retorna el objeto con su ID generado
    public Puesto guardarPuesto(Puesto puesto) {
        return puestoRepository.save(puesto);
    }

    public List<Puesto> findPuestosPorEmpresa(String email) {
        Empresa e = empresaRepository.findById(email).orElse(null);
        return puestoRepository.findByEmailEmpresa(e);
    }

    public List<Caracteristica> listarCaracteristicasAdmin() {

        return caracteristicaRepository.findAll();
    }

    //================HABILIDADESPUESTOS=============================//

    public Oferente buscarOferentePorEmail(String email) {
        return oferenteRepository.findByEmail(email).orElse(null);
    }

    public List<OferenteCaracteristica> listarCaracteristicasOferente(String cedula) {
        return oferenteCaracteristicaRepository.findByCedulaOferenteCedula(cedula);
    }

    public List<Caracteristica> listaCaracteristicasPadre(){
        return caracteristicaRepository.findByIdPadreIsNull();

    }


    public Caracteristica buscarCaracteristicaPorId(Integer id) {
        return caracteristicaRepository.findById(id).orElse(null);
    }

    public void guardarOferenteCaracteristica(OferenteCaracteristica oc, Integer idCaracteristica) {
        // Buscamos la característica técnica (Java, SQL, etc.) por su ID
        Caracteristica c = caracteristicaRepository.findById(idCaracteristica).orElse(null);
        if (c != null) {
            oc.setIdCaracteristica(c);
            oferenteCaracteristicaRepository.save(oc);
        }
    }

    //================CV=============================//

    public void guardarOferente(Oferente oferente) {
        oferenteRepository.save(oferente);
    }

    //=======================MATCH CANDIDATOS===========================

    public List<CandidatoMatch> buscarCandidatosParaPuesto(Integer idPuesto) {
        //  Obtener los requisitos del puesto
        List<PuestoCaracteristica> requisitos = puestoCaracteristicaRepository.findAll()
                .stream().filter(pc -> pc.getIdPuesto().getId().equals(idPuesto))
                .collect(Collectors.toList());

        if (requisitos.isEmpty()) return new ArrayList<>();

        List<Oferente> todosLosOferentes = oferenteRepository.findAll();
        List<CandidatoMatch> resultados = new ArrayList<>();

        for (Oferente oferente : todosLosOferentes) {
            List<OferenteCaracteristica> habilidadesCandidato =
                    oferenteCaracteristicaRepository.findByCedulaOferenteCedula(oferente.getCedula());

            int coincidencias = 0;


            for (PuestoCaracteristica req : requisitos) {
                for (OferenteCaracteristica hab : habilidadesCandidato) {

                    // 1. ¿Son la misma?
                    boolean matchDirecto = hab.getIdCaracteristica().getId().equals(req.getIdCaracteristica().getId());

                    // 2. ¿El candidato tiene un HIJO de lo que pide el puesto? (Caso: Puesto pide Lenguajes, Candidato tiene Java)
                    boolean candidatoTieneEspecialidad = verificarSiEsAncestro(req.getIdCaracteristica(), hab.getIdCaracteristica());

                    // 3. ¿El candidato tiene el PADRE de lo que pide el puesto? (Caso: Puesto pide Java, Candidato tiene Lenguajes)
                    boolean candidatoTieneBaseGeneral = verificarSiEsAncestro(hab.getIdCaracteristica(), req.getIdCaracteristica());

                    if ((matchDirecto || candidatoTieneEspecialidad || candidatoTieneBaseGeneral)
                            && hab.getNivel() >= req.getNivelDeseado()) {
                        coincidencias++;
                        break;
                    }
                }
            }

            // Calcular porcentaje
            double porcentaje = (double) coincidencias / requisitos.size() * 100;

            if (porcentaje > 0) {
                CandidatoMatch match = new CandidatoMatch();
                match.setOferente(oferente);
                match.setPorcentaje(Math.round(porcentaje * 100.0) / 100.0);
                match.setCoincidencias(coincidencias);
                resultados.add(match);
            }
        }

        // Ordenar de mayor a menor afinidad
        resultados.sort((a, b) -> Double.compare(b.getPorcentaje(), a.getPorcentaje()));
        return resultados;
    }

    private boolean verificarSiEsAncestro(Caracteristica ancestroBuscado, Caracteristica objetivo) {
        Caracteristica actual = objetivo;
        // Agregamos la validación 'actual != null' para seguridad
        while (actual != null && actual.getIdPadre() != null) {
            if (actual.getIdPadre().getId().equals(ancestroBuscado.getId())) {
                return true;
            }
            actual = actual.getIdPadre();
        }
        return false;
    }

    public void guardarPuestoCaracteristica(Puesto puesto, Integer caracteristicaId, Integer nivel) {
        if (caracteristicaId == null) return; // Evita errores si la fila estaba vacía

        Caracteristica car = caracteristicaRepository.findById(caracteristicaId).orElse(null);
        if (car != null) {
            PuestoCaracteristica pc = new PuestoCaracteristica();
            pc.setIdPuesto(puesto);
            pc.setIdCaracteristica(car);
            pc.setNivelDeseado(nivel);
            puestoCaracteristicaRepository.save(pc);
        }
    }

    public void desactivarPuesto(Integer id) {
        Puesto puesto = puestoRepository.findById(id).orElse(null);
        if (puesto != null) {
            puesto.setActivo(false);
            puestoRepository.save(puesto);
        }
    }


    /*=======VISTA PRINCIPAL=============*/

    public List<Puesto> listarPuestosParaOferenteLogueado() {
        return puestoRepository.findAll().stream()
                .filter(p -> p.getActivo() == true) // Ve públicas y privadas
                .collect(Collectors.toList());
    }

    public List<Puesto> listar5UltimosPuestosPublicos() {
        return puestoRepository.findAll().stream()
                .filter(p -> p.getActivo() && "PUBLICA".equalsIgnoreCase(p.getTipoPublicacion()))
                // Ordenamos por fechaRegistro de forma descendente (más nuevo primero)
                .sorted((p1, p2) -> p2.getFechaPublicacion().compareTo(p1.getFechaPublicacion()))
                .limit(5)
                .collect(Collectors.toList());
    }

    //=========Buscar puestos===============//
    public List<Caracteristica> listarCategoriasRaiz() {
        return caracteristicaRepository.findByIdPadreIsNull();
    }

    public List<Caracteristica> listarSubcategorias(Caracteristica padre) {
        return caracteristicaRepository.findByIdPadre(padre); //
    }


    public List<Caracteristica> listarSubcategoriasPorId(Integer idPadre) {
        // Primero obtenemos el objeto padre usando el ID
        Caracteristica padre = caracteristicaRepository.findById(idPadre).orElse(null);
        if (padre != null) {

            return caracteristicaRepository.findByIdPadre(padre);
        }
        return new ArrayList<>();
    }

    public List<Puesto> buscarPuestosFiltrados(List<Integer> ids, String moneda) {
        return puestoRepository.findAll().stream()
                .filter(p -> p.getActivo() != null && p.getActivo()
                        && "PUBLICA".equalsIgnoreCase(p.getTipoPublicacion()))
                // Filtro por Moneda (si se seleccionó una)
                .filter(p -> {
                    if (moneda == null || moneda.isEmpty()) return true;
                    return moneda.equalsIgnoreCase(p.getMoneda());
                })
                // Filtro por Características (si se seleccionaron)
                .filter(p -> {
                    if (ids == null || ids.isEmpty()) return true;
                    return p.getPuestoCaracteristicas().stream()
                            .anyMatch(pc -> ids.contains(pc.getIdCaracteristica().getId()));
                })
                .collect(Collectors.toList());
    }

    public Resource obtenerArchivoCV(String cedula) throws Exception {
        Oferente oferente = oferenteRepository.findByCedula(cedula)
                .orElseThrow(() -> new Exception("Oferente no encontrado con cédula: " + cedula));

        String nombreArchivo = oferente.getCurriculoPath();

        if (nombreArchivo == null || nombreArchivo.isEmpty()) {
            throw new Exception("El oferente no tiene un CV registrado.");
        }
        Path archivoPath = root.resolve(nombreArchivo).normalize();
        Resource recurso = new UrlResource(archivoPath.toUri());

        if (recurso.exists() || recurso.isReadable()) {
            return recurso;
        } else {
            throw new Exception("No se pudo leer el archivo: " + nombreArchivo);
        }
    }

    //================ADMIN-REPORTES-PDF================//
    public byte[] generarReporteEmpresasPDF(int mes) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();

        // Título Principal
        Font fontTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.BLUE);
        Paragraph titulo = new Paragraph("REPORTE MENSUAL DE PUESTOS - MES " + mes, fontTitulo);
        titulo.setAlignment(Element.ALIGN_CENTER);
        document.add(titulo);
        document.add(new Paragraph(" ")); // Espacio

        List<Puesto> puestos = puestoRepository.findByMes(mes);

        for (Puesto p : puestos) {
            document.add(new Paragraph("Empresa: " + p.getEmailEmpresa().getNombre(), FontFactory.getFont(FontFactory.HELVETICA_BOLD)));
            document.add(new Paragraph("Puesto: " + p.getDescripcion() + " | Salario: $" + p.getSalarioOfrecido()));

            // Tabla de Requisitos
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // Cabecera de tabla
            table.addCell(new PdfPCell(new Phrase("Requisito Técnico", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));
            table.addCell(new PdfPCell(new Phrase("Nivel Deseado", FontFactory.getFont(FontFactory.HELVETICA_BOLD))));

            List<PuestoCaracteristica> pcList = puestoCaracteristicaRepository.findByIdPuesto(p);
            for (PuestoCaracteristica pc : pcList) {
                table.addCell(pc.getIdCaracteristica().getNombre());
                table.addCell(String.valueOf(pc.getNivelDeseado()));
            }
            document.add(table);
            document.add(new Paragraph("----------------------------------------------------------------------------------"));
        }

        document.close();
        return out.toByteArray();
    }

    // --- GENERAR REPORTE 2: OFERENTES Y ESTADÍSTICAS ---
    public byte[] generarReporteOferentesPDF() throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();
        document.add(new Paragraph("REPORTE GENERAL DE OFERENTES Y HABILIDADES", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16)));
        document.add(new Paragraph(" "));

        List<Oferente> oferentes = oferenteRepository.findAll();

        // Variables para estadísticas
        int totalHabilidadesGlobal = 0;
        double sumaNivelesGlobal = 0;

        for (Oferente o : oferentes) {
            document.add(new Paragraph("Candidato: " + o.getNombre() + " " + o.getApellido() + " (Céd: " + o.getCedula() + ")"));

            List<OferenteCaracteristica> habilidades = oferenteCaracteristicaRepository.findByCedulaOferenteCedula(o.getCedula());

            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(80);
            for (OferenteCaracteristica oc : habilidades) {
                table.addCell(oc.getIdCaracteristica().getNombre());
                table.addCell("Nivel: " + oc.getNivel());

                // Acumulamos para las estadísticas
                totalHabilidadesGlobal++;
                sumaNivelesGlobal += oc.getNivel();
            }
            document.add(table);
            document.add(new Paragraph(" "));
        }

        // Calculos de las Estadisticas
        document.add(new Paragraph(" "));
        Paragraph estTitulo = new Paragraph("RESUMEN ESTADÍSTICO", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.DARK_GRAY));
        document.add(estTitulo);

        int totalCandidatos = oferentes.size();
        document.add(new Paragraph("Total de Candidatos Registrados: " + totalCandidatos));

        if (totalCandidatos > 0) {
            double promHabilidades = (double) totalHabilidadesGlobal / totalCandidatos;
            double promNivel = totalHabilidadesGlobal > 0 ? sumaNivelesGlobal / totalHabilidadesGlobal : 0;

            document.add(new Paragraph("Promedio de habilidades por candidato: " + String.format("%.2f", promHabilidades)));
            document.add(new Paragraph("Nivel técnico promedio general: " + String.format("%.2f", promNivel)));
        }

        document.close();
        return out.toByteArray();
    }
}
