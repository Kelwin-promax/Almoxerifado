package com.almoxerifado.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "movimentacoes")
public class Movimentacao {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "produto_id", nullable = false)
    private Produto produto;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMovimentacao tipo;
    
    @Column(nullable = false)
    private Integer quantidade;
    
    @Column(name = "quantidade_anterior", nullable = false)
    private Integer quantidadeAnterior;
    
    @Column(name = "quantidade_nova", nullable = false)
    private Integer quantidadeNova;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    @Column(name = "data_hora")
    private LocalDateTime dataHora;
    
    @PrePersist
    protected void onCreate() {
        dataHora = LocalDateTime.now();
    }
}
