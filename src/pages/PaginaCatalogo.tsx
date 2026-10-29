import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardProducto } from "../componentes/CardProducto";
import { FiltrosCatalogo } from "../componentes/FiltrosCatalogo";
import { FormularioEdicionProducto } from "../componentes/FormularioEdicionProducto";
import { FormularioProducto } from "../componentes/FormularioProducto";
import { productosService } from "../services/productos";
import { useAuthStore } from "../store/useAuthStore"; // <-- no olviden importar el store !! ya no tenemos el service de auth
import type { Producto } from "../types/producto";
import { useDebounce } from "../hooks/useDebounce";
import { useApi } from "../hooks/useApi";
import { extraerMensaje } from "../lib/errorHandler";
import { EncabezadoPagina } from "../componentes/EncabezadoPagina";
import { useTipoCambio } from "../hooks/useTipoCambio";

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

export function PaginaCatalogo() {
  // checamos si es admin directamente del store global (eliminamos a la prop esAdmin que teniamos antes)
  const esAdmin = useAuthStore((s) => s.esAdmin());

  // estado local de productos y filtros
  // aqui vamos hacer uso de USEAPI con el ejemplo de productos

  //  const [productos, setProductos] = useState<Producto[]>([]);
  //  const [cargando, setCargando] = useState(true);
  //  const [error, setError] = useState("");
  const [accionando, setAccionando] = useState<number | null>(null);
  const { bsPorDolar, error: errorTipoCambio } = useTipoCambio();

  //console.log("Tipo de cambio", bsPorDolar);
  //console.log("Error tipo de cambio", errorTipoCambio);

  const [categoria, setCategoria] = useState("Todas");

  const {
    data: productoData,
    cargando,
    error: errorApi,
    recargar,
  } = useApi(() => productosService.getAll(categoria));

  const productos = productoData ?? [];
  const [errorLocal, setErrorLocal] = useState("");
  const error = errorLocal || errorApi;

  //estados de la busqueda
  const [query, setQuery] = useState("");
  const queryDebounced = useDebounce(query, 500);

  const [orden, setOrden] = useState<Orden>("recientes");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoProducto, setNuevoProducto] = useState("");

  const [nuevaCategoria, setNuevaCategoria] = useState("Electrónica");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [nuevaImagenUrl, setNuevaImagenUrl] = useState("");
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null,
  );

  // al hacer uso del USEAPI podemos borrar el use effect que tenemos
  // Por que ya no lo usamos? porque el hook useApi se encarga de ejecutar la peticion y reaccionar a cambios o incluso usar el recargar cuando creemos editemos y eliminesmos

  /*useEffect(() => {
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
  }, []);*/

  const filtrados = productos
    .filter((producto) => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(queryDebounced.toLowerCase().trim()); // filtrando el valor con pausa
      const coincideCategoria =
        categoria === "Todas" || producto.categoria === categoria;
      return coincideNombre && coincideCategoria;
    })
    .sort((a, b) => {
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
      if (orden === "stock") return b.stock - a.stock;
      return b.id - a.id;
    });

  const productosDisponibles = productos.filter((p) => p.stock > 0).length;
  const stockTotal = productos.reduce((total, p) => total + p.stock, 0);

  const handleAgregarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const precio = Number(nuevoPrecio);
    if (!nuevoNombre.trim() || !Number.isFinite(precio) || precio <= 0) return;
    try {
      setAccionando(-1);

      // Creamos el producto en la API
      await productosService.create({
        nombre: nuevoNombre.trim(),
        categoria: nuevaCategoria,
        precio,
        stock: 5,
        descripcion: nuevaDescripcion.trim(),
        imagenUrl: nuevaImagenUrl.trim(),
      });

      // llamamos a recargar()desde el useApi para actualizar la lista automáticamente
      recargar();

      // lmpiamos el formulario
      setNuevoNombre("");
      setNuevoPrecio("");
      setNuevaDescripcion("");
      setNuevaImagenUrl("");
    } catch (err) {
      // podemos mantener un useState local solo para errores de inputs
      setErrorLocal(extraerMensaje(err));
    } finally {
      setAccionando(null);
    }
  };

  const handleEditarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!productoEditando) return;
    if (
      !productoEditando.nombre.trim() ||
      productoEditando.precio <= 0 ||
      productoEditando.stock < 0
    )
      return;
    setAccionando(productoEditando.id);
    try {
      setErrorLocal("");
      await productosService.update(productoEditando.id, productoEditando);

      recargar(); // recargamos actualizamos la lista llamando a useApi
    } catch (err) {
      setErrorLocal(obtenerMensajeError(err, "No se pudo editar el producto."));
    } finally {
      setAccionando(null);
      setProductoEditando(null);
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      setAccionando(id);
      setErrorLocal("");
      await productosService.delete(id);

      recargar(); // recargamos actualizamos la lista llamando a useApi
    } catch (err) {
      setErrorLocal(
        obtenerMensajeError(err, "No se pudo eliminar el producto."),
      );
    } finally {
      setAccionando(null);
    }
  };

  const categorias = [
    ...CATEGORIAS_BASE,
    ...Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean))),
  ].filter((opcion, indice, opciones) => opciones.indexOf(opcion) === indice);

  return (
    <main className="page">
      <EncabezadoPagina
        titulo="Catálogo de productos"
        descripcion="Catálogo conectado a una API"
      />

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
              <h2 id="add-product-title">Agregar producto</h2>
            </div>
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
            onNombreChange={(e) => setNuevoNombre(e.target.value)}
            onCategoriaChange={(e) => setNuevaCategoria(e.target.value)}
            onPrecioChange={(e) => setNuevoPrecio(e.target.value)}
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
            <p className="kicker">CATÁLOGO</p>
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
          onQueryChange={(e) => setQuery(e.target.value)}
          onCategoriaChange={(e) => setCategoria(e.target.value)}
          onOrdenChange={(e) => setOrden(e.target.value as Orden)}
        />

        {bsPorDolar === null && <p>Cargando el tipo de cambio...</p>}

        {errorTipoCambio && (
          <p className="feedback error">
            Error al obtener el tipo de cambio, no se pudo obtener
          </p>
        )}

        {error ?? <p className="feedback error">{error}</p>}

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
                bsPorDolar={bsPorDolar}
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
