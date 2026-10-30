type TipoAlerta = "info" | "exito" | "advertencia" | "error";

interface Props {
  tipo: TipoAlerta;
  titulo: string;
  mensaje: string;
  onCerrar?: () => void;
}

const CONFIG: Record<TipoAlerta, { bg: string; text: string; icon: string }> = {
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-700",
    icon: "\u2139",
  },
  exito: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-700",
    icon: "\u2713",
  },
  advertencia: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-700",
    icon: "\u26A0",
  },
  error: {
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-700",
    icon: "\u2715",
  },
};

export function AlertaBanner({ tipo, titulo, mensaje, onCerrar }: Props) {
  const { bg, text, icon } = CONFIG[tipo];

  return (
    <div className={`mt-4 flex gap-3 rounded-lg border p-4 ${bg}`} role="alert">
      <span className={`text-lg ${text}`}>{icon}</span>
      <div className="flex-1">
        {titulo && <p className={`font-semibold ${text}`}>{titulo}</p>}
        <p className={`text-sm ${text}`}>{mensaje}</p>
      </div>
      {onCerrar && (
        <button
          type="button"
          aria-label="Cerrar alerta"
          onClick={onCerrar}
          className={`border-0 bg-transparent text-sm ${text} hover:opacity-70`}
        >
          ×
        </button>
      )}
    </div>
  );
}
