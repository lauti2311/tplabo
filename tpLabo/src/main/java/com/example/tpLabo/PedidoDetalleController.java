package com.example.tpLabo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class PedidoDetalleController {

    private final PedidoDetalleService pedidoDetalleService;
    private final PedidoRepository pedidoRepository; // Inyecta el repositorio de pedidos

    @Autowired
    public PedidoDetalleController(PedidoDetalleService pedidoDetalleService, PedidoRepository pedidoRepository) {
        this.pedidoDetalleService = pedidoDetalleService;
        this.pedidoRepository = pedidoRepository;
    }

    @PostMapping("/api/pedidoDetalles")
    public List<PedidoDetalle> createPedidoDetalles(@RequestBody List<PedidoDetalle> pedidoDetalles) {
        List<PedidoDetalle> savedPedidoDetalles = new ArrayList<>();

        for (PedidoDetalle pedidoDetalle : pedidoDetalles) {
            // Busca el pedido correspondiente
            Pedido pedido = pedidoRepository.findById(pedidoDetalle.getPedido().getId())
                    .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

            // Asocia el detalle al pedido
            pedidoDetalle.setPedido(pedido);
            pedido.addPedidoDetalle(pedidoDetalle);

            // Guarda el detalle
            savedPedidoDetalles.add(pedidoDetalleService.save(pedidoDetalle));
        }

        return savedPedidoDetalles;
    }
}