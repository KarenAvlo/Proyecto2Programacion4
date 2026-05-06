package com.example.proyecto1programacion4.presentation;

import com.example.proyecto1programacion4.logic.LogicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class IndexController {

    @Autowired
    private LogicService logicService;

    @GetMapping("/")
    public String home(Authentication auth, Model model) {
        if (auth != null && auth.isAuthenticated()) {
            model.addAttribute("puestos", logicService.listarPuestosParaOferenteLogueado());
            model.addAttribute("logueado", true);
        } else {

            model.addAttribute("puestos", logicService.listar5UltimosPuestosPublicos());
            model.addAttribute("logueado", false);
        }
        return "index";
    }

    @GetMapping("/puestos/buscar")
    public String buscarPuestos(Model model) {
        model.addAttribute("categorias", logicService.listarCategoriasRaiz());
        model.addAttribute("logicService", logicService);
        return "buscar_puestos";
    }

    @PostMapping("/puestos/buscar")
    public String procesarBusqueda(
            @RequestParam(value = "caracteristicas", required = false) List<Integer> ids,
            @RequestParam(value = "moneda", required = false) String moneda,
            Model model) {


        model.addAttribute("resultados", logicService.buscarPuestosFiltrados(ids, moneda));

        model.addAttribute("categorias", logicService.listarCategoriasRaiz());
        model.addAttribute("logicService", logicService);
        return "buscar_puestos";
    }
}