interface Props {
  titulo: string;
  descripcion: string;
  accion?: { label: string; onClick: () => void };
}

export function EstadoVacio({ titulo, descripcion, accion }: Props) {
  return (
    <div className="py-16 text-center">
      <p className="mb-4 text-4xl">{"\u{1F4ED}"}</p>

      <h3 className="font-semibold text-slate-700">{titulo}</h3>

      {descripcion && (
        <p className="mt-1 text-sm text-slate-500">{descripcion}</p>
      )}

      {accion && (
        <button
          type="button"
          className="mt-4 border-0 bg-transparent text-sm text-indigo-600 hover:text-indigo-800"
          onClick={accion.onClick}
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}
