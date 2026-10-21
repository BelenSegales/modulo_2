import { useEffect, useState } from "react";
import axios from "axios";
import { AuthPage } from "./componentes/AuthPage";
import { PaginaCatalogo } from "./pages/PaginaCatalogo";
import { authService } from "./services/auth";
import "./App.css";

function App() {
  const [autenticado, setAutenticado] = useState(
    () => Boolean(localStorage.getItem("token")),
  );
  const [verificandoSesion, setVerificandoSesion] = useState(autenticado);
  const [usuarioNombre, setUsuarioNombre] = useState(
    () => localStorage.getItem("usuarioNombre") ?? "",
  );
  const [usuarioRol, setUsuarioRol] = useState(
    () => localStorage.getItem("usuarioRol") ?? "",
  );
  const [mostrarAuth, setMostrarAuth] = useState(false);

  useEffect(() => {
    if (!autenticado) {
      return;
    }

    const verificarSesion = async () => {
      try {
        const usuario = await authService.me();
        setUsuarioNombre(usuario.nombre);
        setUsuarioRol(usuario.rol);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          authService.logout();
          setAutenticado(false);
        }
      } finally {
        setVerificandoSesion(false);
      }
    };

    void verificarSesion();
  }, [autenticado]);

  if (verificandoSesion) {
    return (
      <>
        <p className="empty app-loading">Verificando sesión...</p>
        <PaginaCatalogo esAdmin={false} />
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
            <button
              type="button"
              className="button secondary"
              onClick={() => {
                authService.logout();
                setAutenticado(false);
              }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <span>Catálogo público</span>
            <button
              type="button"
              className="button secondary"
              onClick={() => setMostrarAuth(true)}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </header>
      <PaginaCatalogo
        esAdmin={autenticado && usuarioRol.toLowerCase() === "admin"}
      />
      {mostrarAuth && !autenticado && (
        <AuthPage
          onLogin={() => {
            setMostrarAuth(false);
            setAutenticado(true);
          }}
          onCancel={() => setMostrarAuth(false)}
        />
      )}
    </>
  );
}

export default App;
