import { useState } from "react";
import type { CrearDTO } from "../types/dtos";

export function useFormularioProducto() {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("Electrónica");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");

  const obtenerDatos = (): CrearDTO | null => {
    const precioNumero = Number(precio);

    if (!nombre.trim() || !Number.isFinite(precioNumero) || precioNumero <= 0) {
      return null;
    }

    return {
      nombre: nombre.trim(),
      categoria,
      precio: precioNumero,
      stock: 5,
      descripcion,
      imagenUrl: imagenUrl.trim(),
    };
  };

  const reset = () => {
    setNombre("");
    setPrecio("");
    setDescripcion("");
    setImagenUrl("");
  };

  return {
    nombre,
    setNombre,
    categoria,
    setCategoria,
    precio,
    setPrecio,
    descripcion,
    setDescripcion,
    imagenUrl,
    setImagenUrl,
    obtenerDatos,
    reset,
  };
}
