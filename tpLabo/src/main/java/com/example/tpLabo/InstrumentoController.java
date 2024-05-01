package com.example.tpLabo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173/") // reemplaza con la URL de tu aplicación React
public class InstrumentoController {
    private final InstrumentoService instrumentoService;

    public InstrumentoController(InstrumentoService instrumentoService) {
        this.instrumentoService = instrumentoService;
    }

    @GetMapping("/api/instrumentos")
    public List<Instrumento> getInstrumentos() {
        return instrumentoService.findAll();
    }

    @GetMapping("/api/instrumentos/{id}")
    public Instrumento getInstrumento(@PathVariable String id) {
        return instrumentoService.findById(id);
}

    @GetMapping("/instrumentos")
    public String getInstrumentos(Model model) {
        // Lee el archivo JSON y conviértelo en una lista de Instrumento
        ObjectMapper mapper = new ObjectMapper();
        List<Instrumento> instrumentos;
        try {
            File file = new ClassPathResource("instrumentos.json").getFile();
            instrumentos = Arrays.asList(mapper.readValue(file, Instrumento[].class));
        } catch (IOException e) {
            throw new RuntimeException("No se pudo leer el archivo JSON", e);
        }

        // Agrega los instrumentos al modelo
        model.addAttribute("instrumentos", instrumentos);

        // Retorna el nombre de la vista (un archivo HTML en src/main/resources/templates)
        return "instrumentos";
    }
}