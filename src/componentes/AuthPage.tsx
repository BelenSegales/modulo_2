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
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const cambiarModo = (nuevoModo: "login" | "registro") => {
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
        await authService.register({ nombre, email, password });
        setMensaje("Registro exitoso. Ahora inicia sesión.");
        setModo("login");
        setNombre("");
        setPassword("");
      } else {
        await authService.login({ email, password });
        onLogin();
      }
    } catch (err) {
      setError(
        obtenerErrorAuth(
          err,
          modo === "registro"
            ? "No se pudo completar el registro."
            : "Email o contraseña incorrectos.",
        ),
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="auth-page" role="dialog" aria-modal="true">
      <section className="auth-card">
        {onCancel && (
          <button type="button" className="auth-close" onClick={onCancel}>
            Volver al catálogo
          </button>
        )}
        <p className="kicker">TIENDA ONLINE</p>
        <h1>{modo === "login" ? "Iniciar sesión" : "Crear cuenta"}</h1>
        <p className="auth-subtitle">
          {modo === "login"
            ? "Accede para administrar productos y probar las mutaciones."
            : "Regístrate para comenzar a utilizar la tienda."}
        </p>
        <div className="auth-tabs" role="tablist" aria-label="Autenticación">
          <button
            type="button"
            className={modo === "login" ? "active" : ""}
            onClick={() => cambiarModo("login")}
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
        <form className="auth-form" onSubmit={(e) => void handleSubmit(e)}>
          {modo === "registro" && (
            <label>
              Nombre
              <input
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </label>
          )}
          <label>
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />
          </label>
          <label>
            Contraseña
            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </label>
          {error && <p className="feedback error">{error}</p>}
          {mensaje && <p className="feedback success">{mensaje}</p>}
          <button className="button primary auth-submit" disabled={cargando}>
            {cargando
              ? "Procesando..."
              : modo === "login"
                ? "Entrar"
                : "Crear cuenta"}
          </button>
        </form>
      </section>
    </main>
  );
}
