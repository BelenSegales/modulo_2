interface Productos {
  nombre: string;
  precio: number;
  stock: number;
}

export function CardIA({ nombre, precio, stock }: Productos) {
  return (
    <button className="p-2 cat-pill-btn group flex flex-col rounded-xl overflow-hidden bg-amber-100 shadow-sm hover:shadow-lg transition-all duration-300 text-left p-space-sm">
      <div className="w-full rounded-lg overflow-hidden bg-surface-container-high mb-space-sm relative">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          data-alt="Assorted luxury skincare serums and hydrating cream jars on a clean pastel pink background with soft diffused studio lighting and botanical rose accents."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzUKcoOvzy2nSpppVgq4m6-9eKn4sqI0Jbp8K7cHpZatWWeLakmWnAichrTrh6a5ACx6FiyW_uhDYXwYGtCZ97MrVjPxsRVk1NUyWIH8UjNt-wd7NST7F-N891faLiRkk_byPSU2bZbLZM0jt56d-_YGiRzPST1xCWoEsQYAB1MYG60pvLjxk7sX8hu5bA5h2T1sBlMv8UzbtkSG8M7Ak29A4mWfc3Eb3K_WLuuWaNb4LD1i_YtItOGA"
        />
        <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors"></div>
      </div>
      <div className="px-space-xs pb-space-xs">
        <h3 className="font-title-md text-title-md font-semibold text-on-surface line-clamp-1 mb-1">
          {nombre}
        </h3>

        {/* Pricing & Action Row */}
        <div className=" bg-amber-50 flex items-center justify-between gap-2 pt-2 border-t border-surface-container">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Precio
            </span>
            <span className="font-headline-sm text-headline-sm text-secondary font-bold">
              Bs {precio}
            </span>
          </div>
          <button
            type="button"
            className="px-4 text-sm py-2.5 rounded-lg bg-surface-variant text-on-surface-variant/60 text-label-md font-semibold cursor-not-allowed select-none"
          >
            {stock === 0 ? "Agotado" : `${stock} Disponibles`}
          </button>
        </div>
      </div>
    </button>
  );
}
