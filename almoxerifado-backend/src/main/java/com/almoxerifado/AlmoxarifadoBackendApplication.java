package com.almoxerifado;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class AlmoxarifadoBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(AlmoxarifadoBackendApplication.class, args);
        System.out.println("Sistema Iniciado!");
        System.out.println("rodando em: http://localhost:8080");
    }
}
