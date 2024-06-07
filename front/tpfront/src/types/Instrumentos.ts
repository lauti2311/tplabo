
interface Instrumento {
    id: number;
    instrumento: string;
    marca: string;
    modelo: string;
    imagen: string;
    precio: string;
    costoEnvio: string;
    cantidadVendida: number;
    descripcion?: string; // Podemos hacer la descripción opcional si no está presente en todos los instrumentos
    idCategoria: number;
  }
  
  export default Instrumento;