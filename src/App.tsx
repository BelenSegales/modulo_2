import { use, useEffect, useState } from "react";
import axios from "axios";
import { AuthPage } from "./componentes/AuthPage";
import { PaginaCatalogo } from "./pages/PaginaCatalogo";
import { authService } from "./services/auth";
import { useAuthStore } from "./store/useAuthStore";
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

  useEffect(() => {
    void verificarSesion();
  }, [verificarSesion]);

  if (verificandoSesion) {
    return (
      <>
        <p className="empty app-loading">Verificando sesión...</p>
        <PaginaCatalogo />
      </>
    );
  }

  return (
    <>
      <header className="session-bar">
        {autenticado ? (
          <>
            <span>
              Sesión: <strong>{usuarioNombre || "Usuario"}</strong>
              {usuarioRol && <small> ({usuarioRol})</small>}
            </span>
            <button type="button" className="button secondary" onClick={logout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <span>Catálogo público</span>
            <button
              type="button"
              className="button secondary"
              onClick={abrirAuth}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </header>
      <PaginaCatalogo />
      {mostrarAuth && !autenticado && <AuthPage onCancel={cerrarAuth} />}
    </>
  );
}

export default App;
