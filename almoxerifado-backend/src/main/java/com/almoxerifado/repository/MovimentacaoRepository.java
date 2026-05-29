package com.almoxerifado.repository;

import com.almoxerifado.model.Movimentacao;
import com.almoxerifado.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MovimentacaoRepository extends JpaRepository<Movimentacao, Long> {
    List<Movimentacao> findByProdutoOrderByDataHoraDesc(Produto produto);
    Page<Movimentacao> findAllByOrderByDataHoraDesc(Pageable pageable);
}