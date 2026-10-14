import React, { useState } from "react";
import { CardProducto } from "../componentes/CardProducto";
import type { Producto } from "../types/producto";

const PRODUCTOS_INICIALES: Producto[] = [
  {
    id: 1,
    nombre: "Audífonos Bluetooth",
    categoria: "Electrónica",
    precio: 180,
    stock: 12,
  },
  {
    id: 2,
    nombre: "Camiseta de algodón",
    categoria: "Ropa",
    precio: 95,
    stock: 0,
  },
  {
    id: 3,
    nombre: "Lámpara de escritorio",
    categoria: "Hogar",
    precio: 220,
    stock: 3,
  },
];

const CATEGORIAS = ["Todas", "Electrónica", "Ropa", "Hogar"];

type Orden = "recientes" | "nombre" | "stock";

export function PaginaCatalogo() {
  // Este estado es la fuente de verdad de todas las tarjetas del catálogo.
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_INICIALES);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [orden, setOrden] = useState<Orden>("recientes");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("Electrónica");
  const [nuevoPrecio, setNuevoPrecio] = useState("");

  // El filtrado y ordenamiento se calculan directamente en cada render.
  // Por ahora no usamos useMemo para mantener el ejemplo sencillo.
  const filtrados = productos
    .filter((producto) => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(query.toLowerCase().trim());
      const coincideCategoria =
        categoria === "Todas" || producto.categoria === categoria;

      return coincideNombre && coincideCategoria;
    })
    .sort((a, b) => {
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "stock") return b.stock - a.stock;
      return b.id - a.id;
    });

  const productosDisponibles = productos.filter(
    (producto) => producto.stock > 0,
  ).length;
  const stockTotal = productos.reduce(
    (total, producto) => total + producto.stock,
    0,
  );

  // onSubmit controla el formulario y evita que el navegador recargue la página.
  const handleAgregarProducto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const precio = Number(nuevoPrecio);
    if (!nuevoNombre.trim() || !Number.isFinite(precio) || precio <= 0) return;

    const nuevoProducto: Producto = {
      id: Date.now(),
      nombre: nuevoNombre.trim(),
      categoria: nuevaCategoria,
      precio,
      stock: 5,
    };

    // Se crea un nuevo array con spread; no se modifica el array anterior.
    setProductos((prev) => [...prev, nuevoProducto]);
    setNuevoNombre("");
    setNuevoPrecio("");
  };

  // Estos inputs son controlados: React guarda y actualiza su valor mediante onChange.
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoNombre(e.target.value);
  };

  const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoPrecio(e.target.value);
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleCategoriaNuevaChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNuevaCategoria(e.target.value);
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoria(e.target.value);
  };

  const handleOrdenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrden(e.target.value as Orden);
  };

  // map devuelve un nuevo array y copia el producto actualizado con spread.
  const handleReponerStock = (id: number) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.id === id
          ? { ...producto, stock: producto.stock + 10 }
          : producto,
      ),
    );
  };

  // filter devuelve un nuevo array sin el producto seleccionado.
  const handleEliminar = (id: number) => {
    setProductos((prev) => prev.filter((producto) => producto.id !== id));
  };

  return (
    <main className="page">
      <header className="hero">
        <p className="kicker">GUÍA DE EVENTOS EN REACT</p>
        <h1>Catálogo de productos</h1>
        <p>
          Ejemplo de inputs controlados, eventos del DOM y actualización
          inmutable del estado.
        </p>
      </header>

      <section className="stats" aria-label="Resumen del catálogo">
        <div>
          <strong>{productos.length}</strong>
          <span>Productos</span>
        </div>
        <div>
          <strong>{productosDisponibles}</strong>
          <span>Disponibles</span>
        </div>
        <div>
          <strong>{stockTotal}</strong>
          <span>Unidades en stock</span>
        </div>
      </section>

      <section className="panel" aria-labelledby="add-product-title">
        <div className="section-title">
          <div>
            <p className="kicker">EVENTO ONSUBMIT</p>
            <h2 id="add-product-title">Agregar producto</h2>
          </div>
          <p>El formulario usa valores controlados.</p>
        </div>

        <form onSubmit={handleAgregarProducto} className="form">
          <label>
            Nombre
            <input
              type="text"
              value={nuevoNombre}
              onChange={handleNombreChange}
              placeholder="Ej. Mochila urbana"
            />
          </label>
          <label>
            Categoría
            <select
              value={nuevaCategoria}
              onChange={handleCategoriaNuevaChange}
            >
              {CATEGORIAS.slice(1).map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </label>
          <label>
            Precio (Bs)
            <input
              type="number"
              min="1"
              value={nuevoPrecio}
              onChange={handlePrecioChange}
              placeholder="0"
            />
          </label>
          <button type="submit" className="button primary">
            Agregar
          </button>
        </form>
      </section>

      <section className="panel" aria-labelledby="products-title">
        <div className="section-title">
          <div>
            <p className="kicker">ESTADO Y EVENTOS</p>
            <h2 id="products-title">Tus productos</h2>
          </div>
          <p>
            Mostrando {filtrados.length} de {productos.length}
          </p>
        </div>

        <div className="filters">
          <label className="search">
            Buscar por nombre
            <input
              type="search"
              value={query}
              onChange={handleQueryChange}
              placeholder="Ej. audífonos"
            />
          </label>
          <label>
            Categoría
            <select value={categoria} onChange={handleCategoriaChange}>
              {CATEGORIAS.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </label>
          <label>
            Ordenar
            <select value={orden} onChange={handleOrdenChange}>
              <option value="recientes">Más recientes</option>
              <option value="nombre">Por nombre</option>
              <option value="stock">Mayor stock</option>
            </select>
          </label>
        </div>

        {filtrados.length > 0 ? (
          <div className="cards">
            {filtrados.map((producto) => (
              <CardProducto
                key={producto.id}
                nombre={producto.nombre}
                categoria={producto.categoria}
                precio={producto.precio}
                stock={producto.stock}
                onReponer={() => handleReponerStock(producto.id)}
                onEliminar={() => handleEliminar(producto.id)}
              />
            ))}
          </div>
        ) : (
          <p className="empty">No encontramos productos con esos filtros.</p>
        )}
      </section>
    </main>
  );
}
