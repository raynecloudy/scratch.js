import { Account } from "./account";

export interface Studio {
  readonly commentsAllowed: boolean;
  readonly description: string;
  readonly everybodyCanAddProjects: boolean;
  readonly host: {
    readonly id: number;
    
    fetch(): Promise<Account>;
  };
  readonly history: {
    readonly created: string;
    readonly lastModified: string;
  };
  readonly id: number;
  readonly stats: {
    readonly comments: number;
    readonly followers: number;
    readonly managers: number;
    readonly projects: number;
  };
  readonly thumbnailUrl: string;
  readonly title: string;
}
