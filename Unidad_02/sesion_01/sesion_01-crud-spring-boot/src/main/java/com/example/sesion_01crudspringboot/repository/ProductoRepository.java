package com.example.sesion_01crudspringboot.repository;

import com.example.sesion_01crudspringboot.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductoRepository extends JpaRepository<Producto,Integer> {
}