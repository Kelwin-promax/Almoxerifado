package com.almoxerifado.service;

import com.almoxerifado.model.Produto;
import com.almoxerifado.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ProdutoService {
    
    @Autowired
    private ProdutoRepository produtoRepository;
    
    public Page<Produto> listar(String nome, LocalDate data, int page, int size) {
        return produtoRepository.buscarComFiltros(nome, data, PageRequest.of(page - 1, size));
    }
    
    public Produto buscarPorId(Long id) {
        return produtoRepository.findById(id).orElse(null);
    }
    
    public Produto criar(Produto produto) {
        return produtoRepository.save(produto);
    }
    
    public Produto atualizar(Long id, Produto produtoAtualizado) {
        Produto produto = buscarPorId(id);
        if (produto != null) {
            produto.setNome(produtoAtualizado.getNome());
            produto.setDescricao(produtoAtualizado.getDescricao());
            produto.setPreco(produtoAtualizado.getPreco());
            return produtoRepository.save(produto);
        }
        return null;
    }
    
    public boolean deletar(Long id) {
        if (produtoRepository.existsById(id)) {
            produtoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}