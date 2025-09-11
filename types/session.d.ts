import { AuthenticatedAccount } from "./account";

export const login: {
  (username: string, password: string): Promise<Session>,
  (token: string): Promise<Session>
};

export class Session {
  csrfToken: string;
  sessionId: string;
  token: string;
  
  constructor(csrfToken: string, sessionId: string, token: string);
  
  fetch(): Promise<AuthenticatedAccount>;
  logout(): Promise<void>;
}
