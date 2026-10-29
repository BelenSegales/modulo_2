const URL_TIPO_CAMBIO = "https://open.er-api.com/v6/latest/USD";

interface RespuestaTipoCambio {
  result: string;
  rates: Record<string, number>;
}

export const tipoCambioService = {
  obtenerBsPorDolar: async (signal?: AbortSignal): Promise<number> => {
    const respuesta = await fetch(URL_TIPO_CAMBIO, { signal });
    if (!respuesta) {
      throw new Error(
        "Error ${respuesta.status} al obtener el tipo de cambio ",
      );
    }

    const datos: RespuestaTipoCambio = await respuesta.json();

    if (datos.result !== "success") {
      throw new Error("La api de tipo de cambio respondio con un error");
    }

    return datos.rates.BOB;
  },
};
