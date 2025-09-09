declare module "scratch.js" {
  const login: (username: string, password: string) => Promise<Session>;
  
  interface Account {
    readonly aboutMe: string;
    readonly country: string;
    readonly id: number;
    readonly isScratchTeam: boolean;
    readonly joined: string;
    readonly whatImWorkingOn: string;
    readonly username: string;
  }
  
  interface Author {
    readonly id: number;
    readonly isScratchTeam: boolean;
    readonly joined: string;
    readonly username: string;
    
    readonly fetch: () => Promise<Account>;
  }
  
  class Session {
    readonly token: string;
    readonly username: string;

    constructor(token: string, username: string);

    readonly logout: () => Promise<void>;
  }

  interface Project {
    readonly author: Author;
    readonly commentsAllowed: boolean;
    readonly history: {
      readonly created: string,
      readonly modified: string,
      readonly shared: string
    };
    readonly id: number;
    readonly instructions: string;
    readonly notesAndCredits: string;
    readonly public: boolean;
    readonly published: boolean;
    readonly stats: {
      readonly favorites: number,
      readonly loves: number,
      readonly remixes: number,
      readonly views: number
    };
    readonly token: string;
    readonly visibility: string;
  }
}
