import { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import PreferenceMP from '../types/PreferenceMP';
import Pedido from '../types/Pedido';

async function createPreferenceMP(pedido : Pedido) {
    const urlServer = 'http://localhost:8080/api/create_preference_mp';
    const response = await fetch(urlServer, {
        method: "POST",
        body: JSON.stringify(pedido),
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}

function CheckoutMP({ montoCarrito = 0 }) {
    const [idPreference, setIdPreference] = useState<string>('');
    const [showMPButton, setShowMPButton] = useState<boolean>(false);

    useEffect(() => {
        initMercadoPago('TEST-a5ae1d64-d199-4315-bd7b-71f56b386d08', { locale: 'es-AR' });
    }, []);

    const getPreferenceMP = async () => {
        if (montoCarrito > 0) {
            const response: PreferenceMP = await createPreferenceMP({ id: 0, totalPedido: montoCarrito });
            console.log("Preference id: " + response.id);
            if (response) {
                setIdPreference(response.id);
                setShowMPButton(true); // Mostrar el botón de Mercado Pago después de obtener la preferencia
            }
        } else {
            alert("Agregue al menos un plato al carrito");
        }
    }

    return (
        <div>
            <button onClick={getPreferenceMP} className='btMercadoPago'>COMPRAR con <br></br> Mercado Pago</button>
            {showMPButton && <div className={idPreference ? 'divVisible' : 'divInvisible'}>
                <Wallet initialization={{ preferenceId: idPreference, redirectMode: "blank" }} customization={{ texts: { valueProp: 'smart_option' } }} />
            </div>}
        </div>
    );
}

export default CheckoutMP;
