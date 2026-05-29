package com.almoxerifado.controller;

import com.almoxerifado.model.Movimentacao;
import com.almoxerifado.model.TipoMovimentacao;
import com.almoxerifado.model.Usuario;
import com.almoxerifado.service.MovimentacaoService;
import com.almoxerifado.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/movimentacoes")
public class MovimentacaoController {
    
    @Autowired
    private MovimentacaoService movimentacaoService;
    
    @Autowired
    private UsuarioService usuarioService;
    
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Map<String, Object> request) {
        try {
            Long produtoId = Long.valueOf(request.get("produtoId").toString());
            TipoMovimentacao tipo = TipoMovimentacao.valueOf(request.get("tipo").toString());
            Integer quantidade = Integer.valueOf(request.get("quantidade").toString());
            
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            Usuario usuario = usuarioService.buscarPorEmail(email);
            if (usuario == null) {
                return ResponseEntity.status(401).body("Usuário autenticado não encontrado");
            }
            
            Movimentacao movimentacao = movimentacaoService.registrar(produtoId, tipo, quantidade, usuario);
            return ResponseEntity.ok(movimentacao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<?> historico(@PathVariable Long produtoId) {
        return ResponseEntity.ok(movimentacaoService.historicoPorProduto(produtoId));
    }
    
    @GetMapping
    public ResponseEntity<Page<Movimentacao>> listarTodas(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(movimentacaoService.listarTodas(page, size));
    }
}
