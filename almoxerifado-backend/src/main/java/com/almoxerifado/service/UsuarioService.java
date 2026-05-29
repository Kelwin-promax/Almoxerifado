package com.almoxerifado.service;

import com.almoxerifado.model.Usuario;
import com.almoxerifado.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public Usuario autenticar(String email, String senha) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario != null && passwordEncoder.matches(senha, usuario.getSenha())) {
            return usuario;
        }
        return null;
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }
    
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }
    
    public Usuario criar(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        return usuarioRepository.save(usuario);
    }
    
    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }
    
    public boolean emailExiste(String email) {
        return usuarioRepository.existsByEmail(email);
    }
}
