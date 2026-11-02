import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
import type { Producto } from "../types/producto";

export type Orden = "recientes" | "nombre" | "stock";
const CATEGORIAS_BASE = ["Todas", "Electronica", "Ropa", "Hogar"];

export function useFiltrosCatalogo(productos: Producto[], categoria: string) {
  const [query, setQuery] = useState("");
  const [orden, setOrden] = useState<Orden>("recientes");
  const queryDebounced = useDebounce(query, 500);

  const filtrados = useMemo(() => {
    const texto = queryDebounced.toLowerCase().trim();

    return productos
      .filter((producto) => {
        const coincideNombre = producto.nombre
          .toLocaleLowerCase()
          .includes(texto);

        const coincideCategoria =
          categoria === "Todas" || producto.categoria === categoria;

        return coincideNombre && coincideCategoria;
      })
      .sort((a, b) => {
        if (orden === "nombre") return a.nombre.localeCompare(b.nombre);
        if (orden === "stock") return b.stock - a.stock;

        return b.id - a.id;
      });
  }, [productos, queryDebounced, categoria, orden]);

  const categorias = useMemo(
    () => [
      ...new Set([
        ...CATEGORIAS_BASE,
        ...productos.map((p) => p.categoria).filter(Boolean),
      ]),
    ],
    [productos],
  );

  const limpiarBusqueda = () => setQuery("");
  return {
    query,
    setQuery,
    orden,
    setOrden,
    filtrados,
    categorias,
    limpiarBusqueda,
  };
}
