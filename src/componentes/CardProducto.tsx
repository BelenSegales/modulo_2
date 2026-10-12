interface Productos {
  nombre: string;
  precio: number;
  stock: number;
}

export function CardProducto({ nombre, precio, stock }: Productos) {
  return (
    <div className="p-4 border rounded-lg bg-amber-100">
      <h3 className="font-bold"> {nombre} </h3>
      <p>${precio} </p>
      <p className={stock === 0 ? "text-red-600" : "text-green-600"}>
        {stock === 0 ? "Agotado" : `${stock} Disponibles`}
      </p>
    </div>
  );
}
