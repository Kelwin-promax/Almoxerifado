package com.almoxerifado.repository;

import com.almoxerifado.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    @Query("SELECT p FROM Produto p WHERE " +
           "(:nome IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :nome, '%'))) AND " +
           "(:data IS NULL OR DATE(p.createdAt) = :data)")
    Page<Produto> buscarComFiltros(@Param("nome") String nome,
                                   @Param("data") LocalDate data,
                                   Pageable pageable);
}