package com.example.sesion_01crudspringboot.service.impl;

import com.example.sesion_01crudspringboot.entity.Categoria;
import com.example.sesion_01crudspringboot.repository.CategoriaRepository;
import com.example.sesion_01crudspringboot.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServicelmpl implements CategoriaService {
    @Autowired
    private CategoriaRepository CategoriaRepository;

    @Override
    public List<Categoria> listar() {
        return CategoriaRepository.findAll();
    }

    @Override
    public Categoria guardar(Categoria categoria) {
        return CategoriaRepository.save(categoria);
    }

    @Override
    public Categoria actualizar(Categoria categoria) {
        return CategoriaRepository.save(categoria);
    }

    @Override
    public Optional<Categoria> listarPorId(Integer id) {
        return CategoriaRepository.findById(id);
    }

    @Override
    public void eliminarPorId(Integer id) {
        CategoriaRepository.deleteById(id);
    }
}