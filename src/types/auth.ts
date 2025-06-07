/**
 * Perfis de usuário disponíveis no sistema
 */
export type UserRole = 'admin' | 'event' | 'client';
/**
 * Interface base do usuário
 */
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string;
}
/**
 * Interface do evento
 */
export interface Event extends BaseUser {
  role: 'event';
}
/**
 * Interface do nte
 */
export interface Client extends BaseUser {
  role: 'client';
}
/**
 * Interface do administrador
 */
export interface Admin extends BaseUser {
  role: 'admin';
}
/**
 * Interface do usuário autenticado
 */
export type User = Admin | Event | Client;
/**
 * Dados necessários para login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}
/**
 * Dados necessários para registro
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
/**
 * Resposta da API de autenticação
 */
export interface AuthResponse {
  user: User;
  token: string;
}
/**
 * Contexto de autenticação
 */
export interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  signOut: () => Promise<void>;
}