package com.almoxerifado.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String tipo;
    private String nome;
    private String email;
    private Long id;
}