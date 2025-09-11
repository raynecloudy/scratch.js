import { Account } from "./account";

export interface Author {
  readonly id: number;
  readonly isScratchTeam: boolean;
  readonly joined: string;
  readonly username: string;
  
  fetch(): Promise<Account>;
}
