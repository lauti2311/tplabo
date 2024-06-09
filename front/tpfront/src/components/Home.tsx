import React from 'react';
import Menu from './Menu';
import { Carousel } from 'react-bootstrap'; // Asegúrate de instalar este paquete
import '../styles/Home.css';

const Home = () => {
  return (
    <div>
    <Menu />
    <div className="home-container home ">
      
      <div className="title-container">
        <h2 className="title">Tienda a Todo Ritmo</h2>
      </div>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="img/slider1.jpg"
            alt="Imagen 1"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="img/slider2.jpg"
            alt="Imagen 2"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="img/slider3.jpg"
            alt="Imagen 3"
          />
        </Carousel.Item>
      </Carousel>
      <div className="description">
        <p>"A Todo Ritmo" es un lugar vibrante y lleno de energía donde los clientes pueden encontrar una amplia variedad de productos para satisfacer todas sus necesidades y deseos. Desde ropa de moda hasta gadgets electrónicos, pasando por artículos para el hogar y accesorios únicos, esta tienda tiene de todo. Con una decoración colorida y moderna, cada rincón invita a explorar y descubrir algo nuevo. El personal es amable y siempre está dispuesto a ayudar a los clientes a encontrar lo que están buscando. Además, "A Todo Ritmo" suele tener promociones y eventos especiales que hacen que la experiencia de compra sea aún más emocionante. ¡Es el lugar perfecto para los que buscan estar a la moda y vivir la vida al máximo!</p>
      </div>
    </div>
    </div>
  );
}

export default Home;