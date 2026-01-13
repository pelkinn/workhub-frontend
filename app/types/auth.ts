export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  access_token: string;
  user: UserProfile;
}

export interface Login {
  email: string;
  password: string;
}

export interface Register {
  email: string;
  password: string;
  name?: string | null;
}
