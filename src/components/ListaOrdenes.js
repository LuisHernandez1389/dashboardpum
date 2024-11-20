import React, { useState, useEffect } from "react";
import { database } from "../firebase"; // Ajusta según la ubicación de tu archivo Firebase
import { ref, onValue } from "firebase/database";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBIcon,
} from "mdb-react-ui-kit";

const ListaOrdenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [activeTab, setActiveTab] = useState("todas"); // Estado para el tab activo

  useEffect(() => {
    const ordenListRef = ref(database, "ordenes");

    const unsubscribe = onValue(ordenListRef, (snapshot) => {
      const ordenList = [];
      snapshot.forEach((childSnapshot) => {
        const orden = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        ordenList.push(orden);
      });
      setOrdenes(ordenList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Función para manejar el clic en una orden
  const handleRowClick = (ordenId) => {
    const detalleUrl = `/ordenes/detalle/${ordenId}`;
    window.open(detalleUrl, "_blank");
  };

  // Filtrar órdenes según el tab activo
  const filteredOrders =
    activeTab === "todas"
      ? ordenes
      : ordenes.filter((orden) =>
          activeTab === "atendidas"
            ? orden.atendido
            : activeTab === "pendientes"
            ? !orden.atendido && !orden.cancelado && !orden.enProceso
            : activeTab === "canceladas"
            ? orden.cancelado
            : orden.enProceso
        );

  return (
    <MDBContainer className="py-5">
      {/* Tabs */}
      <MDBRow>
        <MDBCol md="12" className="mb-4">
          <MDBTabs pills className="mb-4">
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => setActiveTab("todas")}
                active={activeTab === "todas"}
              >
                <MDBIcon fas icon="list" className="me-2" />
                Todas
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => setActiveTab("atendidas")}
                active={activeTab === "atendidas"}
              >
                <MDBIcon fas icon="check-circle" className="me-2" />
                Atendidas
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => setActiveTab("pendientes")}
                active={activeTab === "pendientes"}
              >
                <MDBIcon fas icon="clock" className="me-2" />
                Pendientes
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => setActiveTab("canceladas")}
                active={activeTab === "canceladas"}
              >
                <MDBIcon fas icon="times-circle" className="me-2" />
                Canceladas
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>
        </MDBCol>
      </MDBRow>

      {/* Contenido del tab */}
      <MDBRow>
        <MDBCol md="12">
          <MDBCard>
            <MDBCardHeader>
              <h6>
                Lista de Órdenes -{" "}
                {activeTab === "todas"
                  ? "Todas"
                  : activeTab === "atendidas"
                  ? "Atendidas"
                  : activeTab === "pendientes"
                  ? "Pendientes"
                  : activeTab === "canceladas"
                  ? "Canceladas"
                  : ""}
              </h6>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBTable striped hover responsive>
                <MDBTableHead>
                  <tr>
                    <th>ID de Orden</th>
                    <th>Fecha de orden</th>
                    <th>Fecha de atencion</th>
                    <th>Precio</th>
                    <th>Estado</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {filteredOrders.map((orden) => (
                    <tr
                      key={orden.id}
                      onClick={() => handleRowClick(orden.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>{orden.id}</td>
                      <td>
                        {orden.fechaCompra
                          ? new Date(orden.fechaCompra).toLocaleString("es-ES")
                          : "Fecha no disponible"}
                      </td>
                      <td>
                      {orden.fechaHoraUltimoCambio || "N/A"}

                      </td>
                      <td>${orden.total || "N/A"}</td>
                      <td>
                        <MDBBadge
                          color={
                            orden.cancelado
                              ? "danger"
                              : orden.enProceso
                              ? "info"
                              : orden.atendido
                              ? "success"
                              : "warning"
                          }
                          pill
                        >
                          {orden.cancelado
                            ? "Cancelada"
                            : orden.enProceso
                            ? "En Proceso"
                            : orden.atendido
                            ? "Atendida"
                            : "Pendiente"}
                        </MDBBadge>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ListaOrdenes;
