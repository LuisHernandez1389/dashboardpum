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

const DetalleOrden = () => {
  const { id } = useParams(); // Obtener el ID de la orden desde la URL
  const [orden, setOrden] = useState(null); // Estado para la orden
  const [loading, setLoading] = useState(true); // Para manejar la carga

  // Cargar detalles de la orden
  useEffect(() => {
    const ordenRef = ref(database, `ordenes/${id}`);
    get(ordenRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setOrden(snapshot.val());
        } else {
          console.error("Orden no encontrada");
        }
      })
      .catch((error) => console.error("Error al cargar la orden:", error))
      .finally(() => setLoading(false));
  }, [id]);

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

  return (
    <MDBContainer fluid className="p-4" style={{ maxWidth: "800px", border: "1px solid #000", borderRadius: "10px" }}>
      {/* Header */}
      <MDBRow className="mb-4">
        <MDBCol size="3" className="d-flex align-items-center">
          {/* Logo */}
          <img
            src="https://firebasestorage.googleapis.com/v0/b/pirotecniacq.appspot.com/o/Noche_de_amor_1706133687956-removebg-preview.png?alt=media&token=2b8c1968-44ee-486b-869d-2b2ad289bf40"
            alt="Logo"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </MDBCol>
        <MDBCol size="6" className="text-center">
          <h4 className="fw-bold mb-1">PIROTECNIA LEYKER</h4>
          <p className="mb-0" style={{ fontSize: "12px" }}>
            "Este documento certifica la entrega de los productos listados. Agradecemos su verificación y firma para
            confirmar que los mismos han sido recibidos en buenas condiciones."
          </p>
        </MDBCol>
        <MDBCol size="3" className="text-end">
          <p className="mb-1">FECHA:</p>
          {orden.fechaHoraUltimoCambio || "N/A"}
          </MDBCol>
      </MDBRow>

      {/* Información del Cliente */}
      <MDBRow className="mb-3">
        <MDBCol size="12">
          <p className="mb-1">
            <strong>CLIENTE:</strong> {orden.cliente || "N/A"}{" "}
            <strong>TELÉFONO:</strong> {orden.telefono || "N/A"}
          </p>
          <p className="mb-1">
            <strong>ENTREGO:</strong> {orden.entrego || "N/A"}{" "}
            <strong>SECTOR:</strong> {orden.sector || "N/A"}
          </p>
        </MDBCol>
      </MDBRow>

      {/* Tabla de Productos */}
      <MDBTable bordered small>
        <MDBTableHead>
          <tr>
            <th>Cantidad</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {orden.productos && orden.productos.length > 0 ? (
            orden.productos.map((producto, index) => (
              <tr key={index}>
                <td>{producto.cantidad}</td>
                <td>{producto.descripcion}</td>
                <td>${producto.precio}</td>
                <td>${producto.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
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
          <div className="border border-dark" style={{ height: "80px" }}>
            {orden.observaciones || "N/A"}
          </div>
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


      {/* Botones para cambiar estado */}
      <MDBRow className="mt-4">
        <MDBCol size="12" className="text-center">
          <MDBBtn color="success" className="me-2" onClick={() => updateStatus({ atendido: true, enProceso: false, cancelado: false })}>
            <MDBIcon fas icon="check-circle" className="me-2" />
            Atendida
          </MDBBtn>
          <MDBBtn color="warning" className="me-2" onClick={() => updateStatus({ enProceso: true, atendido: false, cancelado: false })}>
            <MDBIcon fas icon="spinner" className="me-2" />
            En Proceso
          </MDBBtn>
          <MDBBtn color="danger" onClick={() => updateStatus({ cancelado: true, atendido: false, enProceso: false })}>
            <MDBIcon fas icon="times-circle" className="me-2" />
            Cancelada
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default DetalleOrden;
