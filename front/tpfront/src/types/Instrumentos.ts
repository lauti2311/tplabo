interface Instrumento {
    id: string;
    instrumento: string;
    marca: string;
    modelo: string;
    imagen: string;
    precio: string;
    costoEnvio: string;
    cantidadVendida: string;
    descripcion: string; // Podemos hacer la descripción opcional si no está presente en todos los instrumentos
  }
  
  export default Instrumento;