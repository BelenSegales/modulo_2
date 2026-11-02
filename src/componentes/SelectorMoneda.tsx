import { useMoneda } from "../hooks/useMoneda";

export function SelectorMoneda() {
  const { moneda, cambiarMoneda, bsPorDolar } = useMoneda();

  return (
    <button
      type="button"
      onClick={cambiarMoneda}
      disabled={bsPorDolar === null}
    >
      {moneda === "BOB" ? "Ver en USD" : "Ver en Bs. "}
    </button>
  );
}
