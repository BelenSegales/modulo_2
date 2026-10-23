import axios, { AxiosError } from "axios";

interface ErrorApi {
  message: string;
  statusCode: number;
}

export function extraerMensaje(err: unknown): string {
  // el error llegue directamente de axios (falla la peticion HTTP)
  if (axios.isAxiosError(err)) {
    const data = (err as AxiosError<ErrorApi>).response?.data;
    return data?.message ?? `Error ${err.response?.status ?? "desconocido"} `;
  }
  // si el error puede ser de problemas de red local
  if (err instanceof Error) {
    return err.message;
  }

  return "Error inesperado";
}
