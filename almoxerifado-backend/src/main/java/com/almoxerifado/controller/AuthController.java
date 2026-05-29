package com.almoxerifado.controller;

import com.almoxerifado.dto.LoginRequestDTO;
import com.almoxerifado.dto.LoginResponseDTO;
import com.almoxerifado.model.Usuario;
import com.almoxerifado.security.JwtUtil;
import com.almoxerifado.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO request) {
        Usuario usuario = usuarioService.autenticar(request.getEmail(), request.getSenha());
        
        if (usuario != null) {
            String token = jwtUtil.gerarToken(usuario.getEmail(), usuario.getTipo().toString());
            return ResponseEntity.ok(new LoginResponseDTO(
                token,
                usuario.getTipo().toString(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getId()
            ));
        }
        
        return ResponseEntity.status(401).body("Email ou senha inválidos");
    }
    
    @GetMapping("/usuarios")
    public ResponseEntity<?> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }
    
    @PostMapping("/usuarios")
    public ResponseEntity<?> criarUsuario(@RequestBody Usuario usuario) {
        if (usuarioService.emailExiste(usuario.getEmail())) {
            return ResponseEntity.badRequest().body("Email já cadastrado");
        }
        return ResponseEntity.ok(usuarioService.criar(usuario));
    }
    
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.ok().build();
    }
}