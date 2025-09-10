import { Account } from "./account";

export const login: {
  (username: string, password: string): Promise<Session>,
  (token: string): Promise<Session>
};

export class Session {
  readonly token: string;
  
  constructor(token: string);
  
  readonly fetch: () => Promise<Account>;
  readonly logout: () => Promise<void>;
}
