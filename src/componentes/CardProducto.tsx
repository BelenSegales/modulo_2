import { useState } from "react";
import { BadgeStock } from "./BadgeStock";

interface CardProductoProps {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagenUrl: string | null;
  esAdmin: boolean;
  onEditar: () => void;
  onEliminar: () => void;
  accionesDeshabilitadas?: boolean;
  bsPorDolar: number | null;
}

export function CardProducto({
  nombre,
  categoria,
  precio,
  stock,
  descripcion,
  imagenUrl,
  esAdmin,
  onEditar,
  onEliminar,
  accionesDeshabilitadas = false,
  bsPorDolar,
}: CardProductoProps) {
  const [imagenDisponible, setImagenDisponible] = useState(Boolean(imagenUrl));
  const precioUsd = bsPorDolar ? precio / bsPorDolar : null;

  return (
    <article className={`card card-${categoria.toLowerCase()}`}>
      {imagenUrl && imagenDisponible ? (
        <img
          className="card-image"
          src={imagenUrl}
          alt={`Imagen de ${nombre}`}
          onError={() => setImagenDisponible(false)}
        />
      ) : (
        <div className="card-image-placeholder">Sin imagen</div>
      )}
      <div className="card-color">
        <span>{categoria}</span>
      </div>

      <div className="card-content">
        <div className="card-title">
          <div>
            <p className="label">Producto</p>
            <h3>{nombre}</h3>
          </div>
          <div className="text-red-500">
            <strong>Bs. {precio} </strong>
            {precioUsd !== null && (
              <small> =$ {precioUsd.toFixed(2)} USD </small>
            )}
          </div>
        </div>

        {descripcion && <p className="card-description">{descripcion}</p>}

        <div className="card-actions">
          <BadgeStock stock={stock} />
          {esAdmin ? (
            <>
              <button
                type="button"
                onClick={onEditar}
                className="button secondary"
                disabled={accionesDeshabilitadas}
              >
                {accionesDeshabilitadas ? "Guardando..." : "Editar"}
              </button>
              <button
                type="button"
                onClick={onEliminar}
                className="button danger"
                disabled={accionesDeshabilitadas}
              >
                Eliminar
              </button>
            </>
          ) : (
            <button type="button" className="button primary buy-button">
              Comprar
            </button>
          )}
        </div>

        {stock === 0 && (
          <p className="card-message">Este producto necesita reposición.</p>
        )}
      </div>
    </article>
  );
}
