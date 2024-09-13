import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./components/NavBar";
import Home from './components/Home';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProducList';
import CrearPaquete from './components/PackageForm';
import EventList from './components/EventList';
import ListaOrdenes from './components/ListaOrdenes';

function App() {
  return (
    <BrowserRouter>
    <Navbar  />
    

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product-form" element={<ProductForm/>} />
          <Route path="/product-list" element={<ProductList/>} />
          <Route path="/package-form" element={<CrearPaquete/>}/>
          <Route path="/event-list" element={<EventList/>} />
          <Route path="/order-list" element={<ListaOrdenes/>} />


        </Routes>
    </BrowserRouter>
  );
}

export default App;
