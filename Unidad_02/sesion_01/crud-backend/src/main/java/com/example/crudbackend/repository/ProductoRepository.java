package com.example.crudbackend.repository;

import com.example.crudbackend.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ProductoRepository extends JpaRepository<Producto,Integer> {
}