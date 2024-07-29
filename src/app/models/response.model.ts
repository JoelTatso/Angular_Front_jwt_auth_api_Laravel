export interface User {

  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;

}

export interface AuthResponse {

  statut : number | string | boolean;
  message : string;
  token : string | null;

}
