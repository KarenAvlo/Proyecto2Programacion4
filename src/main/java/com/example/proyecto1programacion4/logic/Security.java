package com.example.proyecto1programacion4.logic;

import com.example.proyecto1programacion4.data.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.stereotype.Service;


@Service
public class Security implements UserDetailsService {

    @Autowired
    private UsuarioRepository  usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario == null) {throw new UsernameNotFoundException("Usuario no encontrado: "+ email);}

        System.out.println("DEBUG - Email intentando: " + email);
        System.out.println("DEBUG - Hash recuperado de DB: " + usuario.getClave());
        System.out.println("DEBUG - Longitud del hash: " + usuario.getClave().length());

        return User.builder()
                .username(usuario.getEmail())
                .password(usuario.getClave())
                .disabled(!usuario.getEstado())
                .authorities("ROLE_"+usuario.getTipo())
                .build();
    }

}
