interface Pedido {
    id?: number;
    fechaPedido: Date;
    totalPedido: number;
    pedidoDetalles?: PedidoDetalle[];
}

export default Pedido;