import { useState } from "react";
import axios from "axios";
import { authService } from "../services/auth";

interface AuthPageProps {
  onLogin: () => void;
  onCancel?: () => void;
}

const obtenerErrorAuth = (error: unknown, mensaje: string) => {
  if (axios.isAxiosError(error)) {
    const detalle = error.response?.data?.detail;
    if (typeof detalle === "string") return detalle;
  }
  return mensaje;
};

export function AuthPage({ onLogin, onCancel }: AuthPageProps) {
  const [modo, setModo] = useState<"Login" | "registro">("Login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpasword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const cambiarModo = (nuevoModo: "Login" | "registro") => {
    setModo(nuevoModo);
    setError("");
    setMensaje("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setMensaje("");
    try {
      if (modo === "registro") {
        //POST para registrar
        await authService.register({ nombre, email, password });
        setMensaje("Registro completo, puedes iniciar sesión");
        setModo("Login");
        setNombre("");
        setpasword("");
      } else {
        //POST para iniciar sesion
        await authService.login({ email, password });
        onLogin();
      }
    } catch (err) {
      setError(
        obtenerErrorAuth(
          err,
          modo === "registro"
            ? "No se pudo completar el registro"
            : "Email o contraseña invalidos",
        ),
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page" role="dialog" aria-modal="true">
      <section className="auth-card">
        {/* Botón opcional para cerrar o regresar */}
        {onCancel && (
          <button type="button" className="auth-close" onClick={onCancel}>
            Volver al catálogo
          </button>
        )}

        <p className="kicker">TIENDA ONLINE</p>
        <h1>{modo === "Login" ? "Iniciar Sesión" : "Crear cuenta"}</h1>
        <p className="auth-subtitle">
          {modo === "Login"
            ? "Accede a tu cuenta para ver mas información"
            : "Registrate para realizar tus compras"}
        </p>

        {/* Pestañas para alternar entre Login y Registro */}
        <div className="auth-tabs" role="tablist" aria-label="Autenticación">
          <button
            type="button"
            className={modo === "Login" ? "active" : ""}
            onClick={() => cambiarModo("Login")}
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            className={modo === "registro" ? "active" : ""}
            onClick={() => cambiarModo("registro")}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario principal */}
        <form className="auth-form" onSubmit={(e) => void handleSubmit(e)}>
          {/* El campo Nombre solo se muestra en modo Registro */}

          {modo === "registro" && (
            <label>
              Nombre
              <input
                required
                value={nombre}
                placeholder="Ingresa tu nombre"
                onChange={(e) => setNombre(e.target.value)}
              ></input>
            </label>
          )}

          <label>
            Email
            <input
              required
              type="email"
              value={email}
              placeholder="correo@ejemplo.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Contraseña
            <input
              required
              minLength={6}
              type="password"
              placeholder="Mínimo 6 caracteres"
              onChange={(e) => setpasword(e.target.value)}
            />
          </label>

          {/* Mensajes de error o éxito */}

          {error && <p className="feedback success">{mensaje}</p>}
          {mensaje && <p className="feedback success">{mensaje} </p>}

          <button className="button primary auth-submit" disabled={cargando}>
            {cargando
              ? "Procesando..."
              : modo === "Login"
                ? "Ingresar"
                : "Crear cuenta"}
          </button>
        </form>
      </section>
    </main>
  );
}
