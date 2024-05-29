package com.example.tpLabo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity

public class PedidoDetalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int cantidad;

    @ManyToOne
    @JoinColumn(name = "idPedido", referencedColumnName = "id")
    @JsonBackReference(value = "pedido-detalles")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "idInstrumento", referencedColumnName = "id")
    @JsonBackReference(value = "instrumento-detalles")
    private Instrumento instrumento;
}
