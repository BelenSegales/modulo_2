import { api } from "../lib/axios";
import type {
  LoginDTO,
  RegistroDTO,
  TokenRespuesta,
  Usuario,
} from "../types/auth";

interface UsuarioApi {
  id: number;
  email: string;
  name: string;
  role: string;
}

const convertirUsuario = (usuario: UsuarioApi): Usuario => ({
  id: usuario.id,
  email: usuario.email,
  nombre: usuario.name,
  rol: usuario.role,
});

export const authService = {
  login: async (datos: LoginDTO) => {
    const respuesta = await api.post<TokenRespuesta>("/auth/login", datos);
    localStorage.setItem("token", respuesta.data.access_token);
    localStorage.setItem("usuarioNombre", respuesta.data.user_name);
    localStorage.setItem("usuarioRol", respuesta.data.user_role);
    return respuesta.data;
  },

  register: async (datos: RegistroDTO) => {
    await api.post<UsuarioApi>("/auth/register", {
      email: datos.email,
      password: datos.password,
      name: datos.nombre,
    });
  },

  me: async () => {
    const respuesta = await api.get<UsuarioApi>("/auth/me");
    return convertirUsuario(respuesta.data);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioNombre");
    localStorage.removeItem("usuarioRol");
  },
};
