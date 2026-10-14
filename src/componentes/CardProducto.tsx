import { BadgeStock } from "./BadgeStock";

interface CardProductoProps {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  onReponer: () => void;
  onEliminar: () => void;
}

export function CardProducto({
  nombre,
  categoria,
  precio,
  stock,
  onReponer,
  onEliminar,
}: CardProductoProps) {
  return (
    <article className={`card card-${categoria.toLowerCase()}`}>
      <div className="card-color">
        <span>{categoria}</span>
      </div>

      <div className="card-content">
        <div className="card-title">
          <div>
            <p className="label">Producto</p>
            <h3>{nombre}</h3>
          </div>
          <strong>Bs {precio}</strong>
        </div>

        <div className="card-actions">
          <BadgeStock stock={stock} />

          {/* onClick recibe una función del padre con el id del producto. */}
          <button type="button" onClick={onReponer} className="button secondary">
            +10 stock
          </button>
          <button type="button" onClick={onEliminar} className="button danger">
            Eliminar
          </button>
        </div>

        {stock === 0 && (
          <p className="card-message">Este producto necesita reposición.</p>
        )}
      </div>
    </article>
  );
}
