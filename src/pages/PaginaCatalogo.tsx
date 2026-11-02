import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardProducto } from "../componentes/CardProducto";
import { FiltrosCatalogo } from "../componentes/FiltrosCatalogo";
import { FormularioEdicionProducto } from "../componentes/FormularioEdicionProducto";
import { FormularioProducto } from "../componentes/FormularioProducto";
import { productosService } from "../services/productos";
import { useAuthStore } from "../store/useAuthStore"; // <-- no olviden importar el store !! ya no tenemos el service de auth
import type { Producto } from "../types/producto";
import { useApi } from "../hooks/useApi";
import { extraerMensaje } from "../lib/errorHandler";
import { EncabezadoPagina } from "../componentes/EncabezadoPagina";
import { useSearchParams } from "react-router-dom";
import { AlertaBanner } from "../componentes/ui/AlertaBanner";
import { EstadoVacio } from "../componentes/ui/EstadoVacio";
import { SkelentonCardProducto } from "../componentes/ui/SkeletonCardProducto";
import { useFiltrosCatalogo, type Orden } from "../hooks/useFiltrosCatalogo";
import { useFormularioProducto } from "../hooks/useFormularioProducto";

import { useMoneda } from "../hooks/useMoneda";

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

  //  const [productos, setProductos] = useState<Producto[]>([]);
  //  const [cargando, setCargando] = useState(true);
  //  const [error, setError] = useState("");
  const [accionando, setAccionando] = useState<number | null>(null);
  const { bsPorDolar, errorTipoCambio } = useMoneda();

  //console.log("Tipo de cambio", bsPorDolar);
  //console.log("Error tipo de cambio", errorTipoCambio);

  // const [categoria, setCategoria] = useState("Todas");

  const [searchParams, setSearchParams] = useSearchParams();
  const pagina = Math.max(1, Number(searchParams.get("pagina")) || 1);
  const categoria = searchParams.get("categoria") ?? "Todas";

  // sin parametos  get(pagina)  null  Number(0)  = 1
  // 3              "3"          3
  // abcde          abcde        Nan                1

  const {
    data: productoData,
    cargando,
    error: errorApi,
    recargar,
  } = useApi(
    () => productosService.getPagina(pagina, POR_PAGINA, categoria),
    [pagina, categoria],
  );

  const POR_PAGINA = 6;

  // const productos = productoData ?? [];

  const productos = productoData?.productos ?? [];
  const hayMas = productoData?.hayMas ?? false;

  // funciones para cambiar de pagina y categoria

  const irAPagina = (nueva: number) => {
    setSearchParams({ pagina: String(nueva), categoria });
  };

  const cambiarCategoria = (nueva: string) => {
    setSearchParams({ pagina: "1", categoria: nueva });
  };

  const [errorLocal, setErrorLocal] = useState("");
  const error = errorLocal || errorApi;

  const [nuevoProducto, setNuevoProducto] = useState("");

  const form = useFormularioProducto();

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

  const productosDisponibles = productos.filter((p) => p.stock > 0).length;
  const stockTotal = productos.reduce((total, p) => total + p.stock, 0);

  const handleAgregarProducto = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = form.obtenerDatos();
    if (!datos) return;

    try {
      setAccionando(-1);

      // Creamos el producto en la API
      await productosService.create(datos);

      // llamamos a recargar()desde el useApi para actualizar la lista automáticamente
      recargar();

      // limpiamos el formulario
      form.reset();
    } catch (err) {
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

  const filtros = useFiltrosCatalogo(productos, categoria);

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
            categorias={filtros.categorias}
            nombre={form.nombre}
            categoria={form.categoria}
            precio={form.precio}
            descripcion={form.descripcion}
            imagenUrl={form.imagenUrl}
            cargando={accionando === -1}
            onSubmit={(e) => void handleAgregarProducto(e)}
            onNombreChange={(e) => form.setNombre(e.target.value)}
            onCategoriaChange={(e) => form.setCategoria(e.target.value)}
            onPrecioChange={(e) => form.setPrecio(e.target.value)}
            onDescripcionChange={(e) => form.setDescripcion(e.target.value)}
            onImagenChange={(e) => form.setImagenUrl(e.target.value)}
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
            Mostrando {filtros.filtrados.length} de {productos.length}
          </p>
        </div>

        <FiltrosCatalogo
          categorias={filtros.categorias}
          query={filtros.query}
          categoria={categoria}
          orden={filtros.orden}
          onQueryChange={(e) => filtros.setQuery(e.target.value)}
          onCategoriaChange={(e) => cambiarCategoria(e.target.value)}
          onOrdenChange={(e) => filtros.setOrden(e.target.value as Orden)}
        />

        {bsPorDolar === null && <p>Cargando el tipo de cambio...</p>}

        {/*
        {errorTipoCambio && (
          <p className="feedback error">
            Error al obtener el tipo de cambio, no se pudo obtener
          </p>
        )}

        {error ?? <p className="feedback error">{error}</p>}


        USO DEL COMPONENTE ALERTABANNER
       */}

        {errorTipoCambio && (
          <AlertaBanner
            tipo="advertencia"
            titulo="Tipo de cambio no disponible"
            mensaje="Los precios solo estan en Bolivianos"
          ></AlertaBanner>
        )}

        {error && (
          <AlertaBanner
            tipo="error"
            titulo="error"
            mensaje={error}
            onCerrar={errorLocal ? () => setErrorLocal("") : undefined}
          ></AlertaBanner>
        )}

        {cargando ? (
          <div className="cards" aria-busy="true">
            {Array.from({ length: POR_PAGINA }).map((_, i) => (
              <SkelentonCardProducto key={i} />
            ))}
          </div>
        ) : filtros.filtrados.length > 0 ? (
          <div className="cards">
            {filtros.filtrados.map((producto) => (
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
          <EstadoVacio
            titulo="No encontramos productos"
            descripcion="Prueba con otra categoria"
            accion={{
              label: "Limpiar los filtros",
              onClick: () => {
                filtros.setQuery("");
                cambiarCategoria("Todas");
              },
            }}
          />
        )}
      </section>

      <div>
        <button
          type="button"
          onClick={() => irAPagina(pagina - 1)}
          className="button"
          disabled={pagina <= 1 || cargando}
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={() => irAPagina(pagina + 1)}
          className="button"
          disabled={!hayMas || cargando}
        >
          Siguiente
        </button>
      </div>
    </main>
  );
}
