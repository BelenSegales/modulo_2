interface EncabezadoPaginaProps {
  titulo: string;
  descripcion: string;
}

export function EncabezadoPagina({
  titulo,
  descripcion,
}: EncabezadoPaginaProps) {
  return (
    <header className="hero">
      <h1>{titulo}</h1>
      <p>{descripcion}</p>
    </header>
  );
}
