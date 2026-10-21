import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardProducto } from "../componentes/CardProducto";
import { FiltrosCatalogo } from "../componentes/FiltrosCatalogo";
import { FormularioEdicionProducto } from "../componentes/FormularioEdicionProducto";
import { FormularioProducto } from "../componentes/FormularioProducto";
import { productosService } from "../services/productos";
import type { Producto } from "../types/producto";

const CATEGORIAS_BASE = ["Todas", "Electrónica", "Ropa", "Hogar"];

type Orden = "recientes" | "nombre" | "stock";

const obtenerMensajeError = (error: unknown, mensajePorDefecto: string) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return "Solo accesso al admin! ";
    }

    const detalle = error.response?.data?.detail;
    if (typeof detalle === "string") return detalle;
  }

  return mensajePorDefecto;
};

interface PaginaCatalogoProps {
  esAdmin?: boolean;
}

export function PaginaCatalogo({ esAdmin = false }: PaginaCatalogoProps) {
  // Este estado es la fuente de verdad de todas las tarjetas del catálogo.
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [accionando, setAccionando] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [orden, setOrden] = useState<Orden>("recientes");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("Electrónica");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevaImagenUrl, setNuevaImagenUrl] = useState("");
  const [productoEditando, setProductoEditando] = useState<Producto | null>(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setError("");
        setProductos(await productosService.getAll());
      } catch {
        setError("No pudimos cargar los productos. Intenta nuevamente.");
      } finally {
        setCargando(false);
      }
    };

    void cargarProductos();
  }, []);

  //  filtrado y ordenamiento se calculan directamente en cada render

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
  const handleAgregarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const precio = Number(nuevoPrecio);
    if (!nuevoNombre.trim() || !Number.isFinite(precio) || precio <= 0) return;

    try {
      setAccionando(-1);
      setError("");
      const nuevoProducto = await productosService.create({
        nombre: nuevoNombre.trim(),
        categoria: nuevaCategoria,
        precio,
        stock: 5,
        descripcion: nuevaDescripcion.trim(),
        imagenUrl: nuevaImagenUrl.trim(),
      });
      setProductos((prev) => [...prev, nuevoProducto]);
      setNuevoNombre("");
      setNuevoPrecio("");
      setNuevaDescripcion("");
      setNuevaImagenUrl("");
    } catch (err) {
      setError(obtenerMensajeError(err, "No se pudo crear el producto."));
    } finally {
      setAccionando(null);
    }
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

  const handleEditarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productoEditando) return;
    const productoAnterior = productos.find(
      (producto) => producto.id === productoEditando.id,
    );
    if (
      !productoAnterior ||
      !productoEditando.nombre.trim() ||
      productoEditando.precio <= 0 ||
      productoEditando.stock < 0
    ) return;
    setAccionando(productoEditando.id);
    try {
      const productoActualizado = await productosService.update(
        productoEditando.id,
        productoEditando,
      );
      setProductos((prev) =>
        prev.map((producto) =>
          producto.id === productoEditando.id ? productoActualizado : producto,
        ),
      );
    } catch (err) {
      setProductos((prev) =>
        prev.map((producto) =>
          producto.id === productoEditando.id ? productoAnterior : producto,
        ),
      );
      setError(obtenerMensajeError(err, "No se pudo editar el producto."));
    } finally {
      setAccionando(null);
      setProductoEditando(null);
    }
  };

  const handleEliminar = async (id: number) => {
    const productosAnteriores = productos;
    setProductos((prev) => prev.filter((producto) => producto.id !== id));

    try {
      setAccionando(id);
      await productosService.delete(id);
    } catch (err) {
      setProductos(productosAnteriores);
      setError(obtenerMensajeError(err, "No se pudo eliminar el producto."));
    } finally {
      setAccionando(null);
    }
  };

  const categorias = [
    ...CATEGORIAS_BASE,
    ...Array.from(
      new Set(productos.map((producto) => producto.categoria).filter(Boolean)),
    ),
  ].filter((opcion, indice, opciones) => opciones.indexOf(opcion) === indice);

  return (
    <main className="page">
      <header className="hero">
        <p className="kicker">GUÍA DE EVENTOS EN REACT</p>
        <h1>Catálogo de productos</h1>
        <p>Catálogo conectado a una API con Axios y operaciones optimistas.</p>
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

      {esAdmin && (
      <section className="panel" aria-labelledby="add-product-title">
        <div className="section-title">
          <div>
            <p className="kicker">EVENTO ONSUBMIT</p>
            <h2 id="add-product-title">Agregar producto</h2>
          </div>
          <p>El formulario usa valores controlados.</p>
        </div>

        <FormularioProducto
          categorias={categorias}
          nombre={nuevoNombre}
          categoria={nuevaCategoria}
          precio={nuevoPrecio}
          descripcion={nuevaDescripcion}
          imagenUrl={nuevaImagenUrl}
          cargando={accionando === -1}
          onSubmit={(e) => void handleAgregarProducto(e)}
          onNombreChange={handleNombreChange}
          onCategoriaChange={handleCategoriaNuevaChange}
          onPrecioChange={handlePrecioChange}
          onDescripcionChange={(e) => setNuevaDescripcion(e.target.value)}
          onImagenChange={(e) => setNuevaImagenUrl(e.target.value)}
        />
      </section>
      )}

      {esAdmin && productoEditando && (
        <FormularioEdicionProducto
          producto={productoEditando}
          cargando={accionando === productoEditando.id}
          onSubmit={(e) => void handleEditarProducto(e)}
          onChange={setProductoEditando}
          onCancel={() => setProductoEditando(null)}
        />
      )}

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

        <FiltrosCatalogo
          categorias={categorias}
          query={query}
          categoria={categoria}
          orden={orden}
          onQueryChange={handleQueryChange}
          onCategoriaChange={handleCategoriaChange}
          onOrdenChange={handleOrdenChange}
        />

        {error && <p className="feedback error">{error}</p>}
        {cargando ? (
          <p className="empty">Cargando productos...</p>
        ) : filtrados.length > 0 ? (
          <div className="cards">
            {filtrados.map((producto) => (
              <CardProducto
                key={producto.id}
                nombre={producto.nombre}
                categoria={producto.categoria}
                precio={producto.precio}
                stock={producto.stock}
                descripcion={producto.descripcion}
                imagenUrl={producto.imagenUrl}
                esAdmin={esAdmin}
                onEditar={() => setProductoEditando({ ...producto })}
                onEliminar={() => void handleEliminar(producto.id)}
                accionesDeshabilitadas={accionando === producto.id}
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
