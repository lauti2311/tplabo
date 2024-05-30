package com.example.tpLabo.services;

import com.example.tpLabo.entities.PedidoDetalle;
import com.example.tpLabo.repositories.PedidoDetalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PedidoDetalleService {
    private final PedidoDetalleRepository pedidoDetalleRepository;

    @Autowired
    public PedidoDetalleService(PedidoDetalleRepository pedidoDetalleRepository) {
        this.pedidoDetalleRepository = pedidoDetalleRepository;
    }

    public PedidoDetalle save(PedidoDetalle pedidoDetalle) {
        return pedidoDetalleRepository.save(pedidoDetalle);
    }
}