package com.example.sesion_01crudspringboot.service;
import com.example.sesion_01crudspringboot.entity.Producto;
import java.util.List;
import java.util.Optional;
public interface ProductoService {
    public List<Producto> listar();

    public Producto guardar(Producto producto);

    public Producto actualizar(Producto producto);

    public Optional<Producto> listarPorId(Integer id);

    public void eliminarPorId(Integer id);
}
