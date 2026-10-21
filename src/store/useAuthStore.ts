import { create } from "zustand";
import axios from "axios";
import { authService } from "../services/auth";
import type { LoginDTO } from "../types/auth";

interface AuthState {
  autenticado: boolean;
  verificandoSesion: boolean;
  usuarioNombre: string;
  usuarioRol: string;
  mostrarAuth: boolean;
  esAdmin: () => boolean;
  verificarSesion: () => Promise<void>;
  login: (datos: LoginDTO) => Promise<void>;
  logout: () => void;
  abrirAuth: () => void;
  cerrarAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  autenticado: Boolean(localStorage.getItem("token")),
  verificandoSesion: Boolean(localStorage.getItem("token")),
  usuarioNombre: localStorage.getItem("usuarioNombre") ?? "",
  usuarioRol: localStorage.getItem("usuarioRol") ?? "",
  mostrarAuth: false,

  esAdmin: () => {
    const state = get();
    return state.autenticado && state.usuarioRol.toLowerCase() === "admin";
  },

  verificarSesion: async () => {
    if (!localStorage.getItem("token")) {
      set({ verificandoSesion: false });
      return;
    }
    try {
      const usuario = await authService.me();
      localStorage.setItem("usuarioNombre", usuario.nombre);
      localStorage.setItem("usuarioRol", usuario.rol);
      set({
        autenticado: true,
        usuarioNombre: usuario.nombre,
        usuarioRol: usuario.rol,
        verificandoSesion: false,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        authService.logout();
        set({
          autenticado: false,
          usuarioNombre: "",
          usuarioRol: "",
          verificandoSesion: false,
        });
      } else {
        set({ verificandoSesion: false });
      }
    }
  },

  login: async (datos: LoginDTO) => {
    await authService.login(datos);
    const nombre = localStorage.getItem("usuarioNombre") ?? "";
    const rol = localStorage.getItem("usuarioRol") ?? "";
    set({
      autenticado: true,
      usuarioNombre: nombre,
      usuarioRol: rol,
      mostrarAuth: false,
    });
  },

  logout: () => {
    authService.logout();
    set({
      autenticado: false,
      usuarioNombre: "",
      usuarioRol: "",
    });
  },

  abrirAuth: () => set({ mostrarAuth: true }),
  cerrarAuth: () => set({ mostrarAuth: false }),
}));
