import React from "react";
import type { Producto } from "../types/producto";

interface FormularioEdicionProductoProps {
  producto: Producto;
  cargando: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (producto: Producto) => void;
  onCancel: () => void;
}

export function FormularioEdicionProducto({
  producto,
  cargando,
  onSubmit,
  onChange,
  onCancel,
}: FormularioEdicionProductoProps) {
  const actualizar = (cambios: Partial<Producto>) =>
    onChange({ ...producto, ...cambios });

  return (
    <section className="panel" aria-labelledby="edit-product-title">
      <div className="section-title">
        <div>
          <p className="kicker">MUTACIÓN PUT</p>
          <h2 id="edit-product-title">Editar producto</h2>
        </div>
        <button type="button" className="button danger" onClick={onCancel}>
          Cancelar
        </button>
      </div>
      <form className="edit-form" onSubmit={onSubmit}>
        <label>
          Nombre
          <input
            value={producto.nombre}
            onChange={(e) => actualizar({ nombre: e.target.value })}
          />
        </label>
        <label>
          Categoría
          <input
            value={producto.categoria}
            onChange={(e) => actualizar({ categoria: e.target.value })}
          />
        </label>
        <label>
          Precio (Bs)
          <input
            type="number"
            min="0"
            value={producto.precio}
            onChange={(e) => actualizar({ precio: Number(e.target.value) })}
          />
        </label>
        <label>
          Stock
          <input
            type="number"
            min="0"
            value={producto.stock}
            onChange={(e) => actualizar({ stock: Number(e.target.value) })}
          />
        </label>
        <label>
          Descripción
          <input
            value={producto.descripcion}
            onChange={(e) => actualizar({ descripcion: e.target.value })}
          />
        </label>
        <label>
          URL de imagen
          <input
            type="url"
            value={producto.imagenUrl ?? ""}
            onChange={(e) => actualizar({ imagenUrl: e.target.value })}
          />
        </label>
        <button type="submit" className="button primary" disabled={cargando}>
          {cargando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}
