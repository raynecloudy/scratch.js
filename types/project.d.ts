import { Author } from "./author";

export interface Project {
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
