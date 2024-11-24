import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { database } from "../firebase"; // Ajusta la ruta si es necesario
import { ref, get, update } from "firebase/database";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import "../styles/detalleOrden.css";

const DetalleOrden = () => {
  const { id } = useParams(); // Obtener el ID de la orden desde la URL
  const [orden, setOrden] = useState(null); // Estado para la orden
  const [productos, setProductos] = useState({}); // Estado para los productos
  const [loading, setLoading] = useState(true); // Para manejar la carga
  const [productoCantidad, setProductoCantidad] = useState({}); // Estado para almacenar las cantidades
  const [paquetes, setPaquetes] = useState({}); // Estado para los paquetes
  const [observaciones, setObservaciones] = useState(""); // Estado para las observaciones
const estadoMarca = orden?.atendido? "atendido": orden?.cancelado? "cancelado": "";  

  // Cargar detalles de la orden
  useEffect(() => {
    const ordenRef = ref(database, `ordenes/${id}`);
    get(ordenRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setOrden(snapshot.val());
          setObservaciones(snapshot.val().observaciones || ""); // Cargar observaciones si ya existen
        } else {
          console.error("Orden no encontrada");
        }
      })
      .catch((error) => console.error("Error al cargar la orden:", error));
  }, [id]);

  // Cargar productos y paquetes de la base de datos
  useEffect(() => {
    if (orden) {
      // Cargar productos
      const productosRef = ref(database, 'productos');
      get(productosRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setProductos(snapshot.val());
          } else {
            console.error("Productos no encontrados");
          }
        })
        .catch((error) => console.error("Error al cargar los productos:", error));

      // Cargar paquetes
      const paquetesRef = ref(database, 'paquetes');
      get(paquetesRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setPaquetes(snapshot.val());
          } else {
            console.error("Paquetes no encontrados");
          }
        })
        .catch((error) => console.error("Error al cargar los paquetes:", error))
        .finally(() => setLoading(false));
    }
  }, [orden]);

  // Contar la cantidad de veces que aparece cada producto en la orden
  useEffect(() => {
    if (orden && orden.productos) {
      const cantidades = {};
      orden.productos.forEach((idProducto) => {
        cantidades[idProducto] = (cantidades[idProducto] || 0) + 1; // Contar la cantidad
      });
      setProductoCantidad(cantidades); // Actualizar el estado con las cantidades
    }
  }, [orden]);

  // Función para obtener la fecha y hora actual
  const obtenerFechaHoraActual = () => {
    const ahora = new Date();
    return ahora.toLocaleString(); // Devuelve fecha y hora en formato legible
  };

  // Función para actualizar el estado de la orden
  const updateStatus = (nuevoEstado) => {
    const fechaHoraActual = obtenerFechaHoraActual();
    const estadoActualizado = {
      ...nuevoEstado,
      fechaHoraUltimoCambio: fechaHoraActual,
    };

    const ordenRef = ref(database, `ordenes/${id}`);
    update(ordenRef, estadoActualizado)
      .then(() => {
        console.log("Estado actualizado correctamente");
        setOrden((prevOrden) => ({
          ...prevOrden,
          ...estadoActualizado,
        }));
      })
      .catch((error) =>
        console.error("Error al actualizar el estado de la orden:", error)
      );
  };

  if (loading) {
    return <p>Cargando detalles de la orden...</p>;
  }

  if (!orden) {
    return <p>La orden no existe.</p>;
  }

  // Agrupar productos por su ID y contar la cantidad
  const productosAgrupados = Object.entries(productoCantidad).map(([idProducto, cantidad]) => {
    const producto = productos[idProducto];
    const paquete = paquetes[idProducto];
    const esPaquete = Boolean(paquete);
    return {
      idProducto,
      cantidad,
      nombre: esPaquete ? paquete.nombre : (producto ? producto.nombre : "Producto no encontrado"),
      descripcion: esPaquete ? paquete.descripcion : (producto ? producto.descripcion : "Descripción no disponible"),
      precio: esPaquete ? paquete.precio : (producto ? producto.precio : "0.00"),
      total: (esPaquete ? paquete.precio : (producto ? producto.precio : 0)) * cantidad,
    };
  });

  
  return (
  <div>
   <MDBContainer fluid className="p-4" style={{ maxWidth: "800px", border: "1px solid #ccc", borderRadius: "10px", position: "relative",}}>
     
{(orden?.atendido || orden?.cancelado) && (
  <div className={`marca-agua ${estadoMarca}`}>
    {orden?.atendido ? "Atendido" : "Cancelado"}
  </div>
)}


      {/* Header */}
  <MDBRow className="mb-4 align-items-center" style={{ borderBottom: "1px solid #ddd", paddingBottom: "15px" }}>
  {/* Logo */}
  <MDBCol size="3" className="d-flex justify-content-center">
    <img
      src="https://firebasestorage.googleapis.com/v0/b/pirotecniacq.appspot.com/o/Noche_de_amor_1706133687956-removebg-preview.png?alt=media&token=2b8c1968-44ee-486b-869d-2b2ad289bf40"
      alt="Logo"
      style={{
        width: "80%",
        height: "auto",
        objectFit: "contain",
        border: "2px solid #ccc",
        borderRadius: "8px",
        padding: "5px",
      }}
    />
  </MDBCol>

  {/* Título y descripción */}
  <MDBCol size="6" className="text-center">
    <h4 className="fw-bold mb-2" style={{ fontSize: "1.5rem", color: "#333" }}>
      PIROTECNIA LEYKER
    </h4>
    <p className="mb-0" style={{ fontSize: "1rem", color: "#666", lineHeight: "1.5" }}>
      "Este documento certifica la entrega de los productos listados. Agradecemos su verificación y firma para confirmar que los mismos han sido recibidos en buenas condiciones."
    </p>
  </MDBCol>

  {/* Fecha */}
  <MDBCol size="3" className="text-end">
    <p className="mb-1" style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#444" }}>
      {orden.fechaHoraUltimoCambio || "N/A"}
    </p>
    
  </MDBCol>
</MDBRow>

{/* Información del Cliente */}
<MDBRow className="mb-3" style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
  <MDBCol size="12">
    <p className="mb-1" style={{ fontSize: "1.1rem", color: "#333" }}>
      <strong>CLIENTE:</strong> {orden.DireccionCompra?.nombre || "N/A"} <br />
      <strong>TELÉFONO:</strong> {orden.usuario?.numeroTelefono || "N/A"}
    </p>
  </MDBCol>
</MDBRow>

{/* Otros detalles de la orden */}
<MDBRow className="mb-3" style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px" }}>
  <MDBCol size="12">
    <p className="mb-1" style={{ fontSize: "1rem", color: "#555" }}>
      <strong>DIRECCIÓN:</strong> {orden.DireccionCompra?.direccion || "N/A"}
    </p>
    <p className="mb-1" style={{ fontSize: "1rem", color: "#555" }}>
      <strong>EMAIL:</strong> {orden.DireccionCompra?.correo || "N/A"}
    </p>
    <p className="mb-1" style={{ fontSize: "1rem", color: "#555" }}>
      <strong>CIUDAD:</strong> {orden.DireccionCompra?.ciudad || "N/A"}
    </p>
    <p className="mb-1" style={{ fontSize: "1rem", color: "#555" }}>
      <strong>COLONIA:</strong> {orden.DireccionCompra?.colonia || "N/A"}
    </p>
    <p className="mb-1" style={{ fontSize: "1rem", color: "#555" }}>
      <strong>C.P.:</strong> {orden.DireccionCompra?.codigoPostal || "N/A"}
    </p>
  </MDBCol>
</MDBRow>


      {/* Tabla de Productos */}
      <MDBTable bordered small>
        <MDBTableHead>
          <tr>
            <th>id</th>
            <th>nombre</th>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {productosAgrupados.length > 0 ? (
            productosAgrupados.map(({ idProducto, cantidad, nombre, descripcion, precio, total }, index) => (
              <tr key={index}>
                <td>{idProducto}</td>
                <td>{nombre}</td>
                <td>{cantidad}</td>
                <td>{descripcion}</td>
                <td>${precio}</td>
                <td>${total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Sin productos
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>


      {/* Observaciones */}
      <MDBRow className="mt-3">
        <MDBCol size="12">
          <p className="mb-1">
            <strong>OBSERVACIONES</strong>
          </p>
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="form-control"
            rows="3"
          />
        </MDBCol>
      </MDBRow>

{/* Footer */}
<MDBRow className="mt-4 align-items-end">
        <MDBCol size="8" className="text-end">
          <p className="mb-1">
            <strong>TOTAL:</strong> ${orden.total || "N/A"}

          </p>
        </MDBCol>
      </MDBRow>
    </MDBContainer>

    {/* Botones para cambiar estado */}
    <MDBRow className="mt-4">
        <MDBCol size="12" className="text-center">
          <MDBBtn color="success" className="me-2" onClick={() => updateStatus({ atendido: true, enProceso: false, cancelado: false })}>
            <MDBIcon fas icon="check-circle" className="me-2" />
            Atender
          </MDBBtn>
          <MDBBtn color="warning" className="me-2" onClick={() => updateStatus({ enProceso: true, atendido: false, cancelado: false })}>
            <MDBIcon fas icon="spinner" className="me-2" />
            En Proceso
          </MDBBtn>
          <MDBBtn color="danger" onClick={() => updateStatus({ cancelado: true, atendido: false, enProceso: false })}>
            <MDBIcon fas icon="times-circle" className="me-2" />
            Cancelar
          </MDBBtn>
        </MDBCol>
      </MDBRow><br></br>
    </div>
  );
};

export default DetalleOrden;
