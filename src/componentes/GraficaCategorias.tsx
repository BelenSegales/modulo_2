import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DatoGrafica {
  categoria: string;
  total: number;
}

export function GraficaCategoria({ datos }: { datos: DatoGrafica[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 font-semibold text-slate-700">
        Productos por categoria
      </h3>
      {/*aca estamos pidiendo que se adapte a los tamaños de dispositivos al 100% */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={datos}
          margin={{ top: 5, right: 20, left: 0, bottom: 40 }}
        >
          {/*lineas divisoras*/}
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          {/*XAXIS . el eje x muestra las categorias con un pequeño giro */}
          <XAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            dataKey="categoria"
            angle={-30}
            textAnchor="end"
          />

          {/*muestra las valores numericos */}
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />

          {/*TOOLTIP la caja flotante que aparece cuando nosotros pasamos el mouse */}
          <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />

          {/*BAR la barra visual redondeada del total */}
          <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
