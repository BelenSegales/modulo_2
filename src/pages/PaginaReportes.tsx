import { useApi } from "../hooks/useApi";
import { GraficaCategoria } from "../componentes/GraficaCategorias";
import { productosService } from "../services/productos";
import { useMemo } from "react";
import { EncabezadoPagina } from "../componentes/EncabezadoPagina";

export function PaginaReportes() {
  const { data: productos, cargando } = useApi(() => productosService.getAll());

  // contar cuantos productos hay por categoria
  const datosGrafica = useMemo(() => {
    if (!productos) return [];

    const conteo: Record<string, number> = {};

    productos.forEach((p) => {
      const cat = p.categoria || "Sin Categoria";
      conteo[cat] = (conteo[cat] || 0) + 1;
    });

    return Object.keys(conteo).map((cat) => ({
      categoria: cat,
      total: conteo[cat],
    }));
  }, [productos]);

  if (cargando)
    return <p className="empty app-loading">Cargando reportes...</p>;

  return (
    <main className="page">
      <EncabezadoPagina
        titulo="Reportes del sistema"
        descripcion="Consulta el resumen de productos por categoría"
      />
      <GraficaCategoria datos={datosGrafica}></GraficaCategoria>
    </main>
  );
}
