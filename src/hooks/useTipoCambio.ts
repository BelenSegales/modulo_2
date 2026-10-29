import { useEffect, useState } from "react";
import { tipoCambioService } from "../services/tipoCambio";

export function useTipoCambio() {
  const [bsPorDolar, setBsPorDolar] = useState<number | null>(null);
  const [error, setError] = useState<String | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    tipoCambioService
      .obtenerBsPorDolar(controller.signal)
      .then((valor) => setBsPorDolar(valor))
      .catch((err) => {
        if (err instanceof DOMException && err.name == "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Error el obtener el tipo de cambio",
        );
      });

    return () => controller.abort();
  }, []);
  return { bsPorDolar, error };
}
