package com.example.sesion_01crudspringboot.repository;

import com.example.sesion_01crudspringboot.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}