interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  stock: number;
}

// omit: crear un tipo copiando todo el producto excepto su id
export type CrearDTO = Omit<Producto, "id">;

// partial con omit : quita el id y agarra todo lo demas pero son opcionales
export type ActualizarDTO = Partial<Omit<Producto, "id">>;

// pick: seleccionamos unicamente campos especificos
export type ResumenProducto = Pick<Producto, "id" | "nombre" | "precio">;
