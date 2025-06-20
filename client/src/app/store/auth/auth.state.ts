export interface User {
  id: string;
  // username: string;
  email: string;
  role: string;
  // token: string;
}

export interface AuthState {
  user: User | null;
}

export const initialAuthState: AuthState = {
  user: null,
};