package com.example.tpLabo;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class InstrumentoService {

    private final InstrumentoRepository instrumentoRepository;

    @Autowired
    public InstrumentoService(InstrumentoRepository instrumentoRepository) {
        this.instrumentoRepository = instrumentoRepository;
    }
        public Instrumento findById(String id) {
            return instrumentoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Instrumento no encontrado con id: " + id));
}
    public List<Instrumento> findAll() {
        return instrumentoRepository.findAll();
    }

    @EventListener
    public void onApplicationEvent(ContextRefreshedEvent event) {
        ObjectMapper mapper = new ObjectMapper();
        TypeReference<List<Instrumento>> typeReference = new TypeReference<>(){};
        InputStream inputStream = TypeReference.class.getResourceAsStream("/instrumentos.json");
        try {
            List<Instrumento> instrumentos = mapper.readValue(inputStream, typeReference);
            instrumentoRepository.saveAll(instrumentos);
            System.out.println("Instrumentos guardados en la base de datos!");
        } catch (IOException e) {
            System.out.println("No se pudieron guardar los instrumentos: " + e.getMessage());
        }
    }
}