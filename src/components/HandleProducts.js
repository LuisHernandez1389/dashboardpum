import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, runTransaction,  update, get } from 'firebase/database';

const HandleProduct = () => {
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidadSeleccionada, setCantidadSeleccionada] = useState('');

  useEffect(() => {
    const productosRef = ref(database, 'productos');
    onValue(productosRef, (snapshot) => {
      const productosData = snapshot.val();
      if (productosData) {
        const listaProductos = Object.values(productosData);
        setProductosDisponibles(listaProductos);
      }
    });
  }, []);

  const handleAgregarProducto = () => {
    if (productoSeleccionado && cantidadSeleccionada) {
      // Convertir la cantidad a un número
      const cantidadActualizada = parseInt(cantidadSeleccionada, 10);
  
      // Verificar si la cantidad es un número válido
      if (!isNaN(cantidadActualizada) && cantidadActualizada > 0) {
        const productoIndex = productosSeleccionados.findIndex((product) => product.id === productoSeleccionado);
  
        if (productoIndex !== -1) {
          // Si el producto ya está en la lista, actualiza la cantidad
          setProductosSeleccionados((prevProductos) => {
            const nuevosProductos = [...prevProductos];
            nuevosProductos[productoIndex].cantidad = cantidadActualizada;
            return nuevosProductos;
          });
        } else {
          // Si el producto no está en la lista, agrégalo
          const producto = productosDisponibles.find((p) => p.id.toString() === productoSeleccionado.toString());
  
          if (producto) {
            setProductosSeleccionados((prevProductos) => [
              ...prevProductos,
              { id: productoSeleccionado, cantidad: cantidadActualizada, nombre: producto.nombre },
            ]);
  
            // Restablece los valores seleccionados
            setProductoSeleccionado('');
            setCantidadSeleccionada('');
          } else {
            console.error('Error: Producto no encontrado.');
          }
        }
      } else {
        console.error('Error: La cantidad debe ser un número válido mayor a 0.');
      }
    }
  };
  
  const restarInventario = async () => {
    try {
      const productosRef = ref(database, 'productos');
  
      // Obtener el inventario actual
      const snapshot = await get(productosRef);
      const currentProductos = snapshot.val();
  
      // Verificar que se haya obtenido correctamente el inventario
      if (currentProductos) {
        // Crear un objeto para almacenar las actualizaciones
        const updates = {};
  
        // Restar la cantidad de productos seleccionados del inventario
        productosSeleccionados.forEach((producto) => {
          const productKey = producto.id;
  
          if (currentProductos[productKey] && currentProductos[productKey].cantidad >= producto.cantidad) {
            // Restar la cantidad del producto
            updates[`${productKey}/cantidad`] = currentProductos[productKey].cantidad - producto.cantidad;
          } else {
            // Manejar caso donde la cantidad en inventario es insuficiente
            console.error(`Error: Cantidad insuficiente en inventario para ${producto.nombre}.`);
          }
        });
  
        // Actualizar el inventario con las modificaciones
        await update(productosRef, updates);
  
        // Limpiar la lista de productos seleccionados después de restar al inventario
        setProductosSeleccionados([]);
        console.log('Productos restados del inventario exitosamente.');
      } else {
        console.error('Error: No se pudo obtener el inventario.');
      }
    } catch (error) {
      console.error('Error al restar al inventario:', error.message);
    }
  };
  
  return (
    <div className="container">
      <h2>Restar al Inventario</h2>
      <div className="mb-3">
        <label className="form-label">Seleccionar Producto</label>
        <select
          className="form-select"
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          value={productoSeleccionado}
        >
          <option value="">Seleccione un producto</option>
          {productosDisponibles.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Cantidad</label>
        <input
          type="number"
          className="form-control"
          value={cantidadSeleccionada}
          onChange={(e) => setCantidadSeleccionada(e.target.value)}
          min="1"
        />
      </div>
      <button type="button" className="btn btn-primary" onClick={handleAgregarProducto}>
        Agregar Producto
      </button>

      {/* Muestra los productos seleccionados */}
      <div className="mb-3">
        <h3>Productos Seleccionados</h3>
        <ul>
          {productosSeleccionados.map((producto) => (
            <li key={producto.id}>
              {producto.nombre} - Cantidad: {producto.cantidad}
            </li>
          ))}
        </ul>
      </div>
      <button type="button" className="btn btn-success" onClick={restarInventario}>
  Restar del Inventario
</button>
    </div>
  );
};

export default HandleProduct;
