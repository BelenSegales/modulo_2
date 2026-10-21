import React from "react";

interface FormularioProductoProps {
  categorias: string[];
  nombre: string;
  categoria: string;
  precio: string;
  descripcion: string;
  imagenUrl: string;
  cargando: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onNombreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoriaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPrecioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescripcionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImagenChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormularioProducto({
  categorias,
  nombre,
  categoria,
  precio,
  descripcion,
  imagenUrl,
  cargando,
  onSubmit,
  onNombreChange,
  onCategoriaChange,
  onPrecioChange,
  onDescripcionChange,
  onImagenChange,
}: FormularioProductoProps) {
  return (
    <form onSubmit={onSubmit} className="form">
      <label>
        Nombre
        <input
          type="text"
          value={nombre}
          onChange={onNombreChange}
          placeholder="Ej. Mochila urbana"
        />
      </label>
      <label>
        Categoría
        <select value={categoria} onChange={onCategoriaChange}>
          {categorias
            .filter((opcion) => opcion !== "Todas")
            .map((opcion) => (
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
          value={precio}
          onChange={onPrecioChange}
          placeholder="0"
        />
      </label>
      <label>
        Descripción
        <input
          type="text"
          value={descripcion}
          onChange={onDescripcionChange}
          placeholder="Descripción del producto"
        />
      </label>
      <label>
        URL de imagen
        <input
          type="url"
          value={imagenUrl}
          onChange={onImagenChange}
          placeholder="https://..."
        />
      </label>
      <button type="submit" className="button primary" disabled={cargando}>
        {cargando ? "Guardando..." : "Agregar"}
      </button>
    </form>
  );
}
