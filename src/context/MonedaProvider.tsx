import { useState, useMemo, type ReactNode} from "react";

import { MonedaContext, type Moneda } from "./MonedaContext";

import { useTipoCambio } from "../hooks/useTipoCambio";

interface MonedaProviderProps {
  children: ReactNode;
}

export function MonedaProvider({ children }: MonedaProviderProps) {
  const { bsPorDolar, error } = useTipoCambio();

  const [moneda, setMoneda] = useState<Moneda>("BOB");

  const value = useMemo(
    () => ({
      bsPorDolar,
      errorTipoCambio: error !== null,
      moneda,
      cambiarMoneda: () => setMoneda((m) => (m === "BOB" ? "USD" : "BOB")),
    }),
    [bsPorDolar, error, moneda],
  );

  return <MonedaContext.Provider value={value}>{children}</MonedaContext.Provider>
}
