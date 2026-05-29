package com.almoxerifado.service;

import com.almoxerifado.model.Movimentacao;
import com.almoxerifado.model.Produto;
import com.almoxerifado.model.TipoMovimentacao;
import com.almoxerifado.model.Usuario;
import com.almoxerifado.repository.MovimentacaoRepository;
import com.almoxerifado.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class MovimentacaoService {
    
    @Autowired
    private MovimentacaoRepository movimentacaoRepository;
    
    @Autowired
    private ProdutoRepository produtoRepository;
    
    @Transactional
    public Movimentacao registrar(Long produtoId, TipoMovimentacao tipo, Integer quantidade, Usuario usuario) {
        Produto produto = produtoRepository.findById(produtoId)
            .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        
        Integer quantidadeAnterior = produto.getQuantidade();
        Integer quantidadeNova = quantidadeAnterior;
        
        if (tipo == TipoMovimentacao.entrada) {
            quantidadeNova = quantidadeAnterior + quantidade;
        } else if (tipo == TipoMovimentacao.saida) {
            if (quantidadeAnterior < quantidade) {
                throw new RuntimeException("Estoque insuficiente. Disponível: " + quantidadeAnterior);
            }
            quantidadeNova = quantidadeAnterior - quantidade;
        } else if (tipo == TipoMovimentacao.ajuste) {
            quantidadeNova = quantidade;
        }
        
        // Atualizar estoque do produto
        produto.setQuantidade(quantidadeNova);
        produtoRepository.save(produto);
        
        // Registrar movimentação
        Movimentacao movimentacao = new Movimentacao();
        movimentacao.setProduto(produto);
        movimentacao.setTipo(tipo);
        movimentacao.setQuantidade(quantidade);
        movimentacao.setQuantidadeAnterior(quantidadeAnterior);
        movimentacao.setQuantidadeNova(quantidadeNova);
        movimentacao.setUsuario(usuario);
        
        return movimentacaoRepository.save(movimentacao);
    }
    
    public List<Movimentacao> historicoPorProduto(Long produtoId) {
        Produto produto = produtoRepository.findById(produtoId).orElse(null);
        if (produto != null) {
            return movimentacaoRepository.findByProdutoOrderByDataHoraDesc(produto);
        }
        return List.of();
    }
    
    public Page<Movimentacao> listarTodas(int page, int size) {
        return movimentacaoRepository.findAllByOrderByDataHoraDesc(PageRequest.of(page - 1, size));
    }
}
