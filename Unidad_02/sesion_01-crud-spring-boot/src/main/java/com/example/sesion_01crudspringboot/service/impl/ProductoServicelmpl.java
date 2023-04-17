package com.example.sesion_01crudspringboot.service.impl;

import com.example.sesion_01crudspringboot.entity.Producto;
import com.example.sesion_01crudspringboot.repository.ProductoRepository;
import com.example.sesion_01crudspringboot.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class ProductoServicelmpl implements ProductoService {
    @Autowired
    private ProductoRepository productoRepository;
    @Override
    public List<Producto> listar() {
        return productoRepository.findAll();
    }
    @Override
    public Producto guardar(Producto producto) {
        return productoRepository.save(producto);
    }
    @Override
    public Producto actualizar(Producto producto) {
        return productoRepository.save(producto);
    }
    @Override
    public Optional<Producto> listarPorId(Integer id) {
        return productoRepository.findById(id);
    }
    @Override
    public void eliminarPorId(Integer id) {
        productoRepository.deleteById(id);
    }
}