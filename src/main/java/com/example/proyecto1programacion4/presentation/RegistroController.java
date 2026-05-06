package com.example.proyecto1programacion4.presentation;


import com.example.proyecto1programacion4.data.UsuarioRepository;
import com.example.proyecto1programacion4.logic.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/registro")
public class RegistroController {
    @Autowired
    private UsuarioRepository usuarioRepository; //para buscar correos duplicados

    @Autowired
    private PasswordEncoder passwordEncoder;
    //private BCryptPasswordEncoder passwordEncoder; //cambiarlo luego

    @Autowired
    private LogicService service;

    @GetMapping("/empresa")
    public String mostrarFormEmpresa(){
        return "form_empresa";
    }

    @GetMapping("/oferente")
    public String mostrarFormOferente(){
        return "form_oferente";
    }

    @PostMapping("/guardar")
    public String guardar(
            @RequestParam("email") String email,
            @RequestParam("clave") String clave,
            @RequestParam("tipo") String tipo,
            // Parámetros para Oferente
            @RequestParam(value = "cedula", required = false) String cedula,
            @RequestParam(value = "nombre", required = false) String nombre,
            @RequestParam(value = "apellido", required = false) String apellido,
            @RequestParam(value = "nacionalidad", required = false) String nacionalidad,
            @RequestParam(value = "telefono", required = false) String telefono,
            @RequestParam(value = "residencia", required = false) String residencia,
            // Parámetros para Empresa
            @RequestParam(value = "localizacion", required = false) String localizacion,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            Model model) {

        try {
            // Verificación de seguridad: ¿Ya existe el correo?
            if (usuarioRepository.findById(email).isPresent()) {
                model.addAttribute("error", "El correo electrónico ya está registrado.");
                return "OFERENTE".equals(tipo) ? "form_oferente" : "form_empresa";
            }

            //  Creación y persistencia según el tipo
            if ("OFERENTE".equals(tipo)) {
                Oferente o = new Oferente();

                // Datos de la clase Usuario (Herencia)
                o.setEmail(email);
                o.setClave(clave);
                o.setTipo("OFERENTE");

                // Datos específicos de Oferente (Requerimientos nuevos)
                o.setCedula(cedula);
                o.setNombre(nombre);
                o.setApellido(apellido);
                o.setNacionalidad(nacionalidad);
                o.setTelefono(telefono);
                o.setResidencia(residencia);

                service.registrarOferente(o); // Guarda en DB

            } else if ("EMPRESA".equals(tipo)) {
                Empresa e = new Empresa();

                // Datos de la clase Usuario (Herencia)
                e.setEmail(email);
                e.setClave(clave);
                e.setTipo("EMPRESA");

                // Datos específicos de Empresa
                e.setNombre(nombre);
                e.setTelefono(telefono);
                e.setLocalizacion(localizacion);
                e.setDescripcion(descripcion);

                service.registrarEmpresa(e); // Guarda en DB
            }


            return "redirect:/login?success";

        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Error en el registro: " + e.getMessage());
            return "OFERENTE".equals(tipo) ? "form_oferente" : "form_empresa";
        }
    }
}
