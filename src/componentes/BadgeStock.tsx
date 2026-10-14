interface BadgeStockProps {
  stock: number;
}

export function BadgeStock({ stock }: BadgeStockProps) {
  return (
    <span className={`stock ${stock === 0 ? "empty" : "available"}`}>
      {stock === 0 ? "Agotado" : `${stock} disponibles`}
    </span>
  );
}
