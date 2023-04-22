package com.example.sesion_01crudspringboot.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productoId;
    private String productoName;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
    
}