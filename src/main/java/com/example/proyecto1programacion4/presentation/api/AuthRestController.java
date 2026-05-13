package com.example.proyecto1programacion4.presentation.api;

import com.example.proyecto1programacion4.data.UsuarioRepository;
import com.example.proyecto1programacion4.logic.JwtService;
import com.example.proyecto1programacion4.logic.Usuario;
import com.example.proyecto1programacion4.presentation.api.dto.LoginRequest;
import com.example.proyecto1programacion4.presentation.api.dto.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthRestController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthRestController(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail());

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "mensaje", "Credenciales inválidas."
            ));
        }

        if (!passwordEncoder.matches(request.getClave(), usuario.getClave())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "mensaje", "Credenciales inválidas."
            ));
        }

        if (usuario.getEstado() == null || !usuario.getEstado()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "mensaje", "Usuario pendiente de aprobación."
            ));
        }

        String token = jwtService.generarToken(usuario);

        return ResponseEntity.ok(new LoginResponse(
                token,
                usuario.getTipo(),
                usuario.getEmail()
        ));
    }
}
