package com.example.tpLabo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173/") // reemplaza con la URL de tu aplicación React
public class InstrumentoController {
    private final InstrumentoService instrumentoService;
    private final CategoriaService categoriaService;

    @Autowired
    public InstrumentoController(InstrumentoService instrumentoService, CategoriaService categoriaService) {
        this.instrumentoService = instrumentoService;
        this.categoriaService = categoriaService;

    }

    @GetMapping("/api/instrumentos")
    public List<Instrumento> getInstrumentos() {
        return instrumentoService.findAll();
    }

    @GetMapping("/api/instrumentos/{id}")
    public Instrumento getInstrumento(@PathVariable Integer id) {
        return instrumentoService.findById(id);
    }

    @PostMapping("/api/instrumentos")
    public Instrumento createInstrumento(@RequestBody Instrumento instrumento, @RequestParam("idCategoria") int idCategoria) {

        Categoria categoria = categoriaService.findById(idCategoria);
        if (categoria == null) {
            throw new CategoriaNotFoundException("Categoria no encontrada con ID: " + idCategoria);
        }

        instrumento.setCategoria(categoria);
        return instrumentoService.save(instrumento);
    }

    @PutMapping("/api/instrumentos/{id}")
    public Instrumento updateInstrumento(@PathVariable Integer id, @RequestBody Instrumento instrumento) {
        Integer idCategoria = instrumento.getIdCategoria();
        if (idCategoria == null) {
            throw new RuntimeException("El id de la categoría no puede ser nulo");
        }
        Categoria categoria = categoriaService.findById(idCategoria);
        if (categoria == null) {
            throw new CategoriaNotFoundException("Categoria no encontrada con ID: " + idCategoria);
        }
        instrumento.setCategoria(categoria);
        return instrumentoService.update(id, instrumento);
    }

    @DeleteMapping("/api/instrumentos/{id}")
    public void deleteInstrumento(@PathVariable Integer id) {
        instrumentoService.delete(id);
    }

    @GetMapping("/api/instrumentos/categoria/{idCategoria}")
    public List<Instrumento> getInstrumentosByCategoria(@PathVariable int idCategoria) {
        return instrumentoService.findByCategoria(idCategoria);
    }

//    @GetMapping("/instrumentos")
//    public String getInstrumentos(Model model) {
//        // Lee el archivo JSON y conviértelo en una lista de Instrumento
//        ObjectMapper mapper = new ObjectMapper();
//        List<Instrumento> instrumentos;
//        try {
//            File file = new ClassPathResource("instrumentos.json").getFile();
//            instrumentos = Arrays.asList(mapper.readValue(file, Instrumento[].class));
//        } catch (IOException e) {
//            throw new RuntimeException("No se pudo leer el archivo JSON", e);
//        }
//
//        // Agrega los instrumentos al modelo
//        model.addAttribute("instrumentos", instrumentos);
//
//        // Retorna el nombre de la vista (un archivo HTML en src/main/resources/templates)
//        return "instrumentos";
//    }
}