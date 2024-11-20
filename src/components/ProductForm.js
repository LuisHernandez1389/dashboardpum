import React, { useState } from 'react'; 
import { database, storage } from '../firebase';
import { ref, set } from 'firebase/database';
import { uploadBytes, ref as storageReference, getDownloadURL } from 'firebase/storage';

function ProductForm() {
  const [product, setProduct] = useState({
    id: '', // Agrega el campo para el ID
    nombre: '',
    descripcion: '',
    precio: '',
    peso: '',
    imagenUrl: '',
    categoria: '', // Agrega el campo para la categoría
    video: '', // Campo para la URL del video
  });

  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga de la imagen
  const [imageOption, setImageOption] = useState('upload'); // Estado para seleccionar la opción de imagen
  const categorias = ['Luz', 'Trueno', 'Baterias']; // Lista de categorías

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true); // Iniciar el estado de carga

    try {
      const storageRef = storageReference(storage, `productos/${product.nombre}_${Date.now()}.jpg`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      setProduct((prevProduct) => ({
        ...prevProduct,
        imagenUrl: imageUrl,
      }));
      setIsLoading(false); // Terminar el estado de carga
    } catch (error) {
      console.error('Error al cargar la imagen:', error);
      setIsLoading(false); // Terminar el estado de carga en caso de error
    }
  };

  const agregarProducto = async (e) => {
    e.preventDefault();

    try {
      const productoData = {
        id: product.id, // Agregar el ID al objeto del producto
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: parseFloat(product.precio),
        peso: parseFloat(product.peso),
        imagenUrl: product.imagenUrl,
        categoria: product.categoria, 
        video: product.video, // Guarda la URL del video
      };

      const newProductRef = ref(database, `productos/${productoData.id}`); // Usar el ID del producto para la referencia

      await set(newProductRef, productoData);
      console.log('Producto agregado con éxito');

      setProduct({
        id: '', // Limpiar el campo de ID
        nombre: '',
        descripcion: '',
        precio: '',
        peso: '',
        imagenUrl: '',
        categoria: '', 
        video: '', // Limpia la URL del video
      });
    } catch (error) {
      console.error('Error al agregar el producto:', error);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="form-control">
        <h2 className="text-center">Agregar Producto</h2>
        <form onSubmit={agregarProducto}>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">ID:</label>
            <input
              className="form-control"
              id="id"
              name="id"
              value={product.id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">Nombre:</label>
            <input
              className="form-control"
              id="nombre"
              name="nombre"
              value={product.nombre}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">Descripción:</label>
            <input
              className="form-control"
              id="descripcion"
              name="descripcion"
              value={product.descripcion}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="precio" className="form-label">Precio:</label>
            <input
              type="number"
              className="form-control"
              id="precio"
              name="precio"
              value={product.precio}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="peso" className="form-label">Peso:</label>
            <input
              type="number"
              className="form-control"
              id="peso"
              name="peso"
              value={product.peso}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="categoria" className="form-label">Categoría:</label>
            <select
              className="form-select"
              id="categoria"
              name="categoria"
              value={product.categoria}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Selecciona una categoría</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Selecciona cómo deseas agregar la imagen:</label>
            <div>
              <input 
                type="radio" 
                id="upload" 
                name="imageOption" 
                value="upload" 
                checked={imageOption === 'upload'}
                onChange={() => setImageOption('upload')}
              />
              <label htmlFor="upload" className="form-label">Subir Imagen</label>
              <input 
                type="radio" 
                id="url" 
                name="imageOption" 
                value="url" 
                checked={imageOption === 'url'}
                onChange={() => setImageOption('url')}
              />
              <label htmlFor="url" className="form-label">Agregar URL de Imagen</label>
            </div>
          </div>
          {imageOption === 'upload' && (
            <div className="mb-3">
              <label htmlFor="imagen" className="form-label">Imagen:</label>
              <input
                type="file"
                className="form-control"
                id="imagen"
                name="imagen"
                onChange={handleImageUpload}
                accept="image/*"
                required // Asegúrate de que este campo sea requerido
              />
            </div>
          )}
          {imageOption === 'url' && (
            <div className="mb-3">
              <label htmlFor="imagenUrl" className="form-label">URL de la Imagen:</label>
              <input
                type="url"
                className="form-control"
                id="imagenUrl"
                name="imagenUrl"
                value={product.imagenUrl}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                required
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="video" className="form-label">URL del Video:</label>
            <input
              type="url"
              className="form-control"
              id="video"
              name="video"
              value={product.video}
              onChange={handleInputChange}
              placeholder="https://youtube.com/..."
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block container d-flex justify-content-center align-items-center"
            disabled={isLoading || (imageOption === 'upload' && !product.imagenUrl)} // Deshabilitar el botón si se está cargando o si no hay imagen
          >
            {isLoading ? 'Cargando imagen...' : 'Agregar Producto'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
