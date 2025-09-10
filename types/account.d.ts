export interface Account {
  readonly aboutMe: string;
  readonly country: string;
  readonly id: number;
  readonly scratchTeam: boolean;
  readonly joined: string;
  readonly whatImWorkingOn: string;
  readonly username: string;
}

export interface AuthenticatedAccount extends Account {
  readonly banned: boolean;
  readonly birthMonth: number;
  readonly birthYear: number;
  readonly confirmEmailBanner: boolean;
  readonly email: string;
  readonly emailVerified: boolean;
  readonly gender: "female" | "male" | "(Prefer not to say)" | (string & {});
  readonly invited: boolean;
  readonly mustResetPassword: boolean;
  readonly mustCompleteRegistration: boolean;
  readonly newScratcher: boolean;
  readonly profileCommentsEnabled: boolean;
  readonly scratcher: boolean;
  readonly shouldUseVpn: boolean;
  readonly student: boolean;
  readonly showWelcome: boolean;
  readonly teacher: boolean;
  readonly teacherInvitee: boolean;
  readonly token: string;
  readonly unsupportedBrowserBanner: boolean;
  readonly withParentEmail: boolean;
}
