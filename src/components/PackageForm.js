import React, { useState, useEffect } from 'react';
import { database, storage } from '../firebase';
import { ref, set, onValue } from 'firebase/database';
import { uploadBytes, ref as storageReference, getDownloadURL } from 'firebase/storage';

function CrearPaquete() {
  const [nombre, setNombre] = useState('');
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [peso, setPeso] = useState('');
  const [id, setId] = useState(''); // Nuevo estado para el ID del paquete

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

  const agregarProducto = () => {
    if (productoSeleccionado) {
      setProductosSeleccionados([...productosSeleccionados, productoSeleccionado]);
      setProductoSeleccionado('');
    }
  };

  const borrarProducto = (index) => {
    const nuevosProductos = [...productosSeleccionados];
    nuevosProductos.splice(index, 1);
    setProductosSeleccionados(nuevosProductos);
  };

  const [imagen, setImagen] = useState(null);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Subir la imagen del paquete al almacenamiento
      const storageRef = storageReference(storage, `imagenes_paquetes/${nombre}_${Date.now()}.jpg`);
      await uploadBytes(storageRef, imagen);
      const imagenUrl = await getDownloadURL(storageRef);

      // Crear objeto de paquete con la URL de la imagen, el precio, el peso y el ID
      const paqueteData = {
        id: id, // Asignar el ID ingresado al paquete
        nombre: nombre,
        productos: productosSeleccionados,
        descripcion: descripcion,
        precio: parseFloat(precio),
        peso: parseFloat(peso),
        imagenUrl: imagenUrl
      };

      // Guardar el paquete en la base de datos usando set() con el ID proporcionado
      const paqueteRef = ref(database, `paquetes/${id}`); // Usa el ID del paquete como clave
      await set(paqueteRef, paqueteData);

      // Limpiar los campos después de enviar los datos
      setId(''); // Limpiar el campo de ID
      setNombre('');
      setProductosSeleccionados([]);
      setDescripcion('');
      setPrecio('');
      setPeso('');
      setImagen(null);
      console.log('Paquete creado exitosamente.');
    } catch (error) {
      console.error('Error al crear el paquete:', error.message);
      alert('Error al crear el paquete. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  return (
    <div className="container">
      <h2>Crear Nuevo Paquete</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ID del Paquete</label>
          <input
            className="form-control"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Ingrese el ID del paquete" // Placeholder para la entrada de ID
            required // Puedes agregar esto si quieres que el campo sea obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre del Paquete</label>
          <input
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required // Puedes agregar esto si quieres que el campo sea obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Seleccionar Producto</label>
          <select
            className="form-select"
            value={productoSeleccionado}
            onChange={(e) => setProductoSeleccionado(e.target.value)}
          >
            <option value="">Seleccione un producto</option>
            {productosDisponibles.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-primary mt-2" onClick={agregarProducto}>
            Agregar Producto
          </button>
        </div>
        <div className="mb-3">
          <label className="form-label">Productos Seleccionados</label>
          <ul>
            {productosSeleccionados.map((producto, index) => (
              <li key={index}>
                {producto}
                <button
                  type="button"
                  className="btn btn-danger ms-2"
                  onClick={() => borrarProducto(index)}
                >
                  Borrar
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required // Puedes agregar esto si quieres que el campo sea obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precio del Paquete</label>
          <input
            type="number"
            className="form-control"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Ingrese el precio"
            required // Puedes agregar esto si quieres que el campo sea obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Peso del Paquete (en gramos)</label>
          <input
            type="number"
            className="form-control"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Ingrese el peso"
            required // Puedes agregar esto si quieres que el campo sea obligatorio
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen del Paquete</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImagenChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Crear Paquete</button>
      </form>
    </div>
  );
}

export default CrearPaquete;
