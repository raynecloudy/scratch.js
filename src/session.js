import { fetch } from "undici";

export const login = (arg1, arg2) => new Promise(async (resolve, reject) => {
  if (arg1 && !arg2) {
    resolve(new Session(arg1));
    return;
  }

  const response = await fetch("https://scratch.mit.edu/accounts/login/", {
    credentials: "include",
    method: "POST",
    headers: {
      "Cookie": "scratchcsrftoken=scratchjs; scratchlanguage=en",
      "Origin": "https://scratch.mit.edu",
      "Referer": "https://scratch.mit.edu/",
      "X-CSRFToken": "scratchjs",
      "X-Requested-With": "XMLHttpRequest",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "useMessages": true,
      "username": arg1,
      "password": arg2
    })
  });
  const setCookie = response.headers.get("Set-Cookie");
  const data = (await response.json())[0];

  if (response.ok) {
    resolve(new Session(setCookie.match(/scratchcsrftoken=(.*?);/)[1], setCookie.match(/scratchsessionsid="(.*)"/)[1], data.token));
  } else {
    reject(data.msg);
  }
});

export class Session {
  csrfToken;
  sessionId;
  token;

  constructor(csrfToken, sessionId, token) {
    this.csrfToken = csrfToken;
    this.sessionId = sessionId;
    this.token = token;
  }

  async fetch() {
    const session = await (await fetch("https://scratch.mit.edu/session/", {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Cookie": `scratchcsrftoken=${this.csrfToken}; scratchlanguage=en; scratchsessionsid="${this.sessionId}"; permissions=%7B%7D`,
        "Origin": "https://scratch.mit.edu",
        "Referer": "https://scratch.mit.edu/",
        "X-Requested-With": "XMLHttpRequest"
      }
    })).json();
    const account = await (await fetch(`https://api.scratch.mit.edu/users/${session.user.username}`)).json();
    return {
      aboutMe: account.profile.bio,
      banned: session.user.banned,
      birthMonth: session.user.birthMonth,
      birthYear: session.user.birthYear,
      country: account.profile.country,
      email: session.user.email,
      emailVerified: session.flags.has_outstanding_email_confirmation,
      gender: session.user.gender,
      id: account.id,
      invited: session.permissions.invited_scratcher,
      joined: account.history.joined,
      mustResetPassword: session.flags.must_reset_password,
      mustCompleteRegistration: session.flags.must_complete_registration,
      newScratcher: session.permissions.new_scratcher,
      profileCommentsEnabled: session.flags.userprofile_comments_enabled,
      scratcher: session.permissions.scratcher,
      scratchTeam: account.scratchteam,
      shouldUseVpn: session.user.should_vpn,
      student: session.permissions.student,
      showWelcome: session.flags.show_welcome,
      teacher: session.permissions.educator,
      teacherInvitee: session.permissions.educator_invitee,
      token: session.user.token,
      unsupportedBrowserBanner: session.flags.unsupported_browser_banner,
      username: account.username,
      whatImWorkingOn: account.profile.status,
      withParentEmail: session.flags.with_parent_email
    };
  }

  async logout() {
    if (!this.token) return;
    await fetch("https://scratch.mit.edu/accounts/logout/", {
      credentials: "include",
      method: "POST",
      headers: {
        "Cookie": `scratchcsrftoken=${this.csrfToken}; scratchlanguage=en`,
        "Origin": "https://scratch.mit.edu",
        "Referer": "https://scratch.mit.edu/",
        "X-CSRFToken": this.csrfToken,
        "X-Requested-With": "application/x-www-form-urlencoded",
        "Content-Type": "application/json"
      }
    });
    this.csrfToken = "";
    this.token = "";
  };
}
