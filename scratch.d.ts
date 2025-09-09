declare module "scratch.js" {
  const login: (username: string, password: string) => Promise<LoginResponse>;

  interface LoginResponse {
    readonly token: string
    readonly tries: number
    readonly user: ScratchUser
  }

  interface ScratchUser {
    readonly aboutMe: string
    readonly country: string
    readonly id: number
    readonly joined: string
    readonly isScratchTeam: boolean
    readonly whatImWorkingOn: string
    readonly username: string
  }
}
