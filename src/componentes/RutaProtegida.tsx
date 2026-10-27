import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface RutaProtegidaProps {
  rolesPermitidos?: string[];
}

export function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const autenticado = useAuthStore((s) => s.autenticado);
  const usuarioRol = useAuthStore((s) => s.usuarioRol);
  const verificandoSesion = useAuthStore((s) => s.verificandoSesion);

  if (verificandoSesion) {
    return <p>Verificando sesión...</p>;
  }

  if (!autenticado) {
    return <Navigate to="/" replace />;
  }

  if (
    rolesPermitidos &&
    !rolesPermitidos.includes(usuarioRol.toLocaleLowerCase())
  ) {
    return <Navigate to="/sin-acceso" replace />;
  }

  return <Outlet />;
}
