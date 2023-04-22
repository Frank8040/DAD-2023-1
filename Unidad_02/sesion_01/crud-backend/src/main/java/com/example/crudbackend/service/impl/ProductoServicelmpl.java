package com.example.crudbackend.service.impl;

import com.example.crudbackend.entity.Categoria;
import com.example.crudbackend.entity.Producto;
import com.example.crudbackend.repository.CategoriaRepository;
import com.example.crudbackend.repository.ProductoRepository;
import com.example.crudbackend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoServicelmpl implements ProductoService {
    @Autowired
    private ProductoRepository productoRepository;
    @Autowired
    private CategoriaRepository categoriaRepository;

    @Override
    public List<Producto> listar() {
        return productoRepository.findAll();
    }

    @Override
    public Producto guardar(Producto producto) {
        Categoria categoria = categoriaRepository.findById(producto.getCategoria().getCategoriaId())
                .orElse(null);
        if (categoria == null) {
            categoria = categoriaRepository.save(producto.getCategoria());
        }
        producto.setCategoria(categoria);
        return productoRepository.save(producto);
    }

    @Override
    public Producto actualizar(Producto producto) {
        Categoria categoria = categoriaRepository.findById(producto.getCategoria().getCategoriaId())
                .orElse(null);
        if (categoria == null) {
            categoria = categoriaRepository.save(producto.getCategoria());
        }
        producto.setCategoria(categoria);
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