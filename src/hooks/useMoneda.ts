import { useContext } from "react";
import { MonedaContext } from "../context/MonedaContext";

export function useMoneda() {
  const contexto = useContext(MonedaContext);

  if (contexto === null) {
    throw new Error("useMoneda debe estar dentro de monedaprovider");
  }
  return contexto;
}
