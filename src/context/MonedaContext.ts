import { createContext } from "react";

export type Moneda = "BOB" | "USD";

export interface MonedaContextValue {
  bsPorDolar: number | null;
  errorTipoCambio: boolean;
  moneda: Moneda;
  cambiarMoneda: () => void;
}

export const MonedaContext = createContext<MonedaContextValue | null>(null);
