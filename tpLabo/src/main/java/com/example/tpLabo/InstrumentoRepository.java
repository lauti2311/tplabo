package com.example.tpLabo;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InstrumentoRepository extends JpaRepository<Instrumento, Integer> {
    @EntityGraph(attributePaths = "categoria") // Cargar la categoría con el Instrumento
    List<Instrumento> findAll();
    List<Instrumento> findByCategoriaId(int idCategoria);

}