import { useEffect } from "react";
import { AuthPage } from "./componentes/AuthPage";
import { PaginaCatalogo } from "./pages/PaginaCatalogo";
import { useAuthStore } from "./store/useAuthStore";
import { PaginaReportes } from "./pages/PaginaReportes";
import { Routes, Route, NavLink } from "react-router-dom";
import { RutaProtegida } from "./componentes/RutaProtegida";
import { PaginaNotFound } from "./pages/PaginaNotfound";
import { PaginaSinAcceso } from "./pages/PaginaSinAcesso";

import "./App.css";

function App() {
  const autenticado = useAuthStore((s) => s.autenticado);
  const verificandoSesion = useAuthStore((s) => s.verificandoSesion);
  const usuarioNombre = useAuthStore((s) => s.usuarioNombre);
  const usuarioRol = useAuthStore((s) => s.usuarioRol);
  const mostrarAuth = useAuthStore((s) => s.mostrarAuth);
  const verificarSesion = useAuthStore((s) => s.verificarSesion);
  const logout = useAuthStore((s) => s.logout);
  const abrirAuth = useAuthStore((s) => s.abrirAuth);
  const cerrarAuth = useAuthStore((s) => s.cerrarAuth);
  const esAdmin = useAuthStore((s) => s.esAdmin());

  useEffect(() => {
    void verificarSesion();
  }, [verificarSesion]);

  return (
    <>
      <header className="session-bar">
        <div className="brand">
          <div>
            <p className="brand-title">Tienda Online</p>
            <p className="brand-subtitle">Tienda de prodcutos varios</p>
          </div>
        </div>

        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `button ${isActive ? "primary" : "secondary"}`
            }
          >
            Catálogo
          </NavLink>

          {esAdmin && (
            <NavLink
              to="/reportes"
              className={({ isActive }) =>
                `button ${isActive ? "primary" : "secondary"}`
              }
            >
              Reportes
            </NavLink>
          )}
        </nav>

        <div className="session-actions">
          {autenticado ? (
            <>
              <div className="user-info">
                <strong>{usuarioNombre || "Usuario"}</strong>
                <span>{usuarioRol || "Cliente"}</span>
              </div>
              <button
                type="button"
                className="button secondary"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              type="button"
              className="button primary"
              onClick={abrirAuth}
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </header>
      {verificandoSesion ? (
        <p className="empty app-loading">Verificando sesión...</p>
      ) : (
        <>
          <Routes>
            {/* RUTA PUBLICA la que ve cualquiera*/}
            <Route path="/" element={<PaginaCatalogo />} />

            <Route path="/sin-acceso" element={<PaginaSinAcceso />} />
            <Route element={<RutaProtegida rolesPermitidos={["admin"]} />}>
              <Route path="/reportes" element={<PaginaReportes />} />
            </Route>

            <Route path="*" element={<PaginaNotFound></PaginaNotFound>}></Route>
          </Routes>

          {mostrarAuth && !autenticado && <AuthPage onCancel={cerrarAuth} />}
        </>
      )}
    </>
  );
}

export default App;
