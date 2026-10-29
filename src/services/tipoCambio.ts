/*
 dentro de la api que estamos usando es importante conocer las apis que estamos usando en este caso 
 https://open.er-api.com/v6/latest/USD"

 y dentro de su documentacion podran observar devuelve: 

 {
  "result": "success",
  "provider": "https://www.exchangerate-api.com",
  "documentation": "https://www.exchangerate-api.com/docs/free",
  "terms_of_use": "https://www.exchangerate-api.com/terms",
  "time_last_update_unix": 1793232151,
  "time_last_update_utc": "Thu, 29 Oct 2026 00:02:31 +0000",
  "time_next_update_unix": 1793319821,
  "time_next_update_utc": "Fri, 30 Oct 2026 00:23:41 +0000",
  "time_eol_unix": 0,
  "base_code": "USD",
  "rates": {
    "USD": 1,
    "AED": 3.672........
 }

 base_code= "USD" todas las tasas estan expresadas respecto a 1 dolar 
 rates.BOB cuantos bolivianos vale 1 dolar 
 y como pueden ver el result para recibir una respuesta "ok" se debe enviar el success


*/

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

    // el error que tenia y porque no mostraba la conversion es porque escribi mal es success lo tenia como "sucess":C

    if (datos.result !== "success") {
      throw new Error("La api de tipo de cambio respondio con un error");
    }

    return datos.rates.BOB;
  },
};
