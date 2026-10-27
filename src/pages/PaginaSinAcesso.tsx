import { Link } from "react-router-dom";
import { EncabezadoPagina } from "../componentes/EncabezadoPagina";

export function PaginaSinAcceso() {
  return (
    <main>
      <EncabezadoPagina
        titulo="Sin Accesso"
        descripcion="Tu cuenta no tiene permisos para ver esta sección"
      />

      <Link to="/" className="button">
        Volver al Catálogo
      </Link>
    </main>
  );
}
