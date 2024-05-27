package com.example.tpLabo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Instrumento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String instrumento;
    private String marca;
    private String modelo;
    private String imagen;
    private String precio;
    private String costoEnvio;
    private String cantidadVendida;
    private String descripcion;


    @ManyToOne
    @JoinColumn(name = "idCategoria", referencedColumnName = "id")
    @JsonBackReference
    private Categoria categoria;

    @OneToMany(mappedBy = "instrumento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<PedidoDetalle> detalles;

    @Transient
    public Integer getIdCategoria() {
        return categoria != null ? categoria.getId() : null;
    }
}