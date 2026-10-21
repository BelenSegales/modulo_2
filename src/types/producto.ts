export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagenUrl: string | null;
}

export interface CrearProductoDTO {
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  descripcion?: string;
  imagenUrl?: string;
}
