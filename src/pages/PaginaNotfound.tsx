import { Link } from "react-router-dom";
import { EncabezadoPagina } from "../componentes/EncabezadoPagina";

export function PaginaNotFound() {
  return (
    <main>
      <EncabezadoPagina
        titulo="Página no encontrada"
        descripcion="La dirección que buscas no existe"
      ></EncabezadoPagina>

      <Link to="/" className="button primary">
        Ir al catálogo
      </Link>
    </main>
  );
}
