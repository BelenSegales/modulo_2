export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  rol: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegistroDTO extends LoginDTO {
  nombre: string;
}

export interface TokenRespuesta {
  access_token: string;
  token_type: string;
  user_role: string;
  user_name: string;
}
