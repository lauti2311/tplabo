package com.example.tpLabo.controllers;

import com.example.tpLabo.entities.Pedido;
import com.example.tpLabo.services.ChartsGoogle;
import com.example.tpLabo.services.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class PedidoController {

    private final PedidoService pedidoService;

    @Autowired
    private ChartsGoogle chartGoogle;

    @Autowired
    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping("/api/pedidos")
    public ResponseEntity<Pedido> createPedido(@RequestBody Pedido pedido) {
        Pedido savedPedido = pedidoService.save(pedido);
        return new ResponseEntity<>(savedPedido, HttpStatus.CREATED);
    }

    @GetMapping("/api/pedidos")
    public List<Pedido> getPedidos() {
        return pedidoService.findAll();
    }

    @GetMapping("/api/pedidos/barchart")
    public List<List<Object>> getBarChartData() {
        List<List<Object>> data = new ArrayList<>();
        data.add(Arrays.asList("Mes/Año", "Cantidad de Pedidos"));

        List<Map<String, Object>> datos = chartGoogle.getDatosChartBar();
        for (Map<String, Object> row : datos) {
            data.add(Arrays.asList(row.get("mes_anio"), row.get("cantidad_pedidos")));
        }
        return data;
    }

    @GetMapping("/api/pedidos/piechart")
    public List<List<Object>> getPieChartData() {
        List<List<Object>> data = new ArrayList<>();
        data.add(Arrays.asList("Instrumento", "Cantidad de Pedidos"));

        List<Map<String, Object>> datos = chartGoogle.getDatosChartPie();
        for (Map<String, Object> row : datos) {
            data.add(Arrays.asList(row.get("instrumento"), row.get("cantidad")));
        }
        return data;
    }



}
