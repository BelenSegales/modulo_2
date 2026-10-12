import { useState } from "react";
import { CardProducto } from "./componentes/CardProducto";
import "./App.css";

interface Producto1 {
  nombre: string;
  precio: number;
  stock: number;
}

function App() {
  const Productos = [
    { nombre: "Zapatos", precio: 5, stock: 10 },
    { nombre: "Carteras", precio: 14, stock: 2 },
    { nombre: "Guantes", precio: 20, stock: 0 },
    { nombre: "Faldas", precio: 30, stock: 5 },
  ];

  const [products, setProducts] = useState<Producto1[]>([
    { nombre: "Zapatos", precio: 5, stock: 10 },
    { nombre: "Carteras", precio: 14, stock: 2 },
    { nombre: "Guantes", precio: 20, stock: 0 },
    { nombre: "Faldas", precio: 30, stock: 5 },
  ]);

  const agregarProducto = () => {
    const nuevoProducto: Producto1 = {
      nombre: "Sombrero",
      precio: 25,
      stock: 3,
    };

    setProducts((prevProductos) => [...prevProductos, nuevoProducto]);
  };

  return (
    <div>
      <div className="grid grid-cols-2">
        <CardProducto nombre="Manzanas" precio={5} stock={10}></CardProducto>
        <CardProducto nombre="Peras" precio={14} stock={2}></CardProducto>
        <CardProducto nombre="Naranjas" precio={20} stock={0}></CardProducto>
        <CardProducto nombre="Uvas" precio={30} stock={5}></CardProducto>
      </div>

      <div>
        {Productos.map((p) => (
          <CardProducto
            nombre={p.nombre}
            precio={p.precio}
            stock={p.stock}
          ></CardProducto>
        ))}
      </div>

      <div>
        <h1>USO DE ESTADOS BASICOS</h1>
        <button
          className="px-4 py-2 bg-indigo-800 text-white"
          onClick={agregarProducto}
        >
          AGREGAR PRODUCTO
        </button>

        <div className="grid grid-cols-2 bg-amber-900 gap-5">
          {products.map((prod) => (
            <CardProducto
              nombre={prod.nombre}
              precio={prod.precio}
              stock={prod.stock}
            ></CardProducto>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
