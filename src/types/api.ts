export interface RespuestaPaginada<T> {
  data: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface RespuestaAPI<T> {
  data: T;
  mensaje?: string;
}
