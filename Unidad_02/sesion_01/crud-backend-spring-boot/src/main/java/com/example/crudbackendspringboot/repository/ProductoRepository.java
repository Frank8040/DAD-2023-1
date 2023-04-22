package com.example.crudbackendspringboot.repository;

import com.example.crudbackendspringboot.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductoRepository extends JpaRepository<Producto,Integer> {
}