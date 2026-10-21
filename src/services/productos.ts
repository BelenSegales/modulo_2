import { api } from "../lib/axios";
import type { CrearProductoDTO, Producto } from "../types/producto";

interface ProductoApi {
  id: number;
  name: string;
  category: string | null;
  price: string | number;
  stock: number;
  description: string | null;
  image_url: string | null;
}

interface ProductoApiUpdate {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  description?: string;
  image_url?: string;
}

const convertirProducto = (producto: ProductoApi): Producto => ({
  id: producto.id,
  nombre: producto.name,
  categoria: producto.category ?? "Sin categoría",
  precio: Number(producto.price),
  stock: producto.stock,
  descripcion: producto.description ?? "",
  imagenUrl: producto.image_url,
});

const convertirDatos = (
  datos: Partial<CrearProductoDTO>,
): ProductoApiUpdate => ({
  ...(datos.nombre !== undefined && { name: datos.nombre }),
  ...(datos.categoria !== undefined && { category: datos.categoria }),
  ...(datos.precio !== undefined && { price: datos.precio }),
  ...(datos.stock !== undefined && { stock: datos.stock }),
  ...(datos.descripcion !== undefined && { description: datos.descripcion }),
  ...(datos.imagenUrl !== undefined && { image_url: datos.imagenUrl }),
});

export const productosService = {
  getAll: async (categoria?: string) => {
    const respuesta = await api.get<ProductoApi[]>("/products/", {
      params: categoria && categoria !== "Todas" ? { category: categoria } : {},
    });

    return respuesta.data.map(convertirProducto);
  },

  create: async (datos: CrearProductoDTO) => {
    const respuesta = await api.post<ProductoApi>(
      "/products/",
      convertirDatos(datos),
    );

    return convertirProducto(respuesta.data);
  },

  update: async (id: number, datos: Partial<CrearProductoDTO>) => {
    const respuesta = await api.put<ProductoApi>(
      `/products/${id}`,
      convertirDatos(datos),
    );

    return convertirProducto(respuesta.data);
  },

  delete: (id: number) => api.delete(`/products/${id}`),
};
