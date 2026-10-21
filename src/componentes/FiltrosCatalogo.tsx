import React from "react";

type Orden = "recientes" | "nombre" | "stock";

interface FiltrosCatalogoProps {
  categorias: string[];
  query: string;
  categoria: string;
  orden: Orden;
  onQueryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCategoriaChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onOrdenChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function FiltrosCatalogo({
  categorias,
  query,
  categoria,
  orden,
  onQueryChange,
  onCategoriaChange,
  onOrdenChange,
}: FiltrosCatalogoProps) {
  return (
    <div className="filters">
      <label className="search">
        Buscar por nombre
        <input
          type="search"
          value={query}
          onChange={onQueryChange}
          placeholder="Ej. audífonos"
        />
      </label>
      <label>
        Categoría
        <select value={categoria} onChange={onCategoriaChange}>
          {categorias.map((opcion) => (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ))}
        </select>
      </label>
      <label>
        Ordenar
        <select value={orden} onChange={onOrdenChange}>
          <option value="recientes">Más recientes</option>
          <option value="nombre">Por nombre</option>
          <option value="stock">Mayor stock</option>
        </select>
      </label>
    </div>
  );
}
