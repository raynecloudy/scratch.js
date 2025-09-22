import { fetch } from "undici";

export const CommentLocation = {
  Project: 0,
  Profile: 1,
  Studio: 2
};

export const login = (arg1, arg2) => new Promise(async (resolve, reject) => {
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
      useMessages: true,
      username: arg1,
      password: arg2
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
      withParentEmail: session.flags.with_parent_email,

      getMessageCount: async () => (await (await fetch(`https://api.scratch.mit.edu/users/${account.username}/messages/count`)).json()).count,
      getMessages: async () => {
        const rawMessages = await (await fetch(`https://api.scratch.mit.edu/users/${account.username}/messages?x-token=${this.token}`)).json()
        let messages = [];
        rawMessages.forEach((rawMessage) => {
          let message = {
            actor: {
              id: rawMessage.actor_id,
              username: rawMessage.actor_username,

              fetch: () => console.log("todo"),
            },
            id: rawMessage.id,
            timestamp: rawMessage.datetime_created,

            isFollowMessage: () => rawMessage.type === "followuser",
            isLoveMessage: () => rawMessage.type === "loveproject",
            isFavoriteMessage: () => rawMessage.type === "favoriteproject",
            isRemixMessage: () => rawMessage.type === "remixproject",
            isCommentMessage: () => rawMessage.type === "addcomment",
            isCuratorInviteMessage: () => rawMessage.type === "curatorinvite",
            isBecomeStudioOwnerMessage: () => rawMessage.type === "becomeownerstudio",
            isStudioActivityMessage: () => rawMessage.type === "studioactivity",
            isForumTopicActivityMessage: () => rawMessage.type === "forumtopic",
            isWelcomeMessage: () => rawMessage.type === "userjoin"
          };
          switch (rawMessage.type) {
            case "loveproject":
            case "favoriteproject":
              message.project = {
                id: rawMessage.project_id,
                title: rawMessage.title,

                fetch: () => console.log("todo")
              };
              break;

            case "remixproject":
              message.originalProject = {
                id: rawMessage.parent_id,
                title: rawMessage.parent_title,

                fetch: () => console.log("todo")
              };
              message.remixProject = {
                id: rawMessage.project_id,
                title: rawMessage.title,

                fetch: () => console.log("todo")
              };
              break;

            case "addcomment":
              message.comment = {
                content: rawMessage.comment_fragment,
                id: rawMessage.comment_id,
                location: {
                  id: rawMessage.comment_obj_id,
                  title: rawMessage.comment_obj_title,
                  type: rawMessage.comment_type,

                  fetch: () => console.log("todo")
                },
                repliedTo: rawMessage.commentee ?? null
              };
              break;

            case "curatorinvite":
            case "becomeownerstudio":
            case "studioactivity":
              message.studio = {
                id: rawMessage.gallery_id,
                title: rawMessage.title,

                fetch: () => console.log("todo")
              };
              break;

            case "forumpost":
              message.topic = {
                id: rawMessage.topic_id,
                title: rawMessage.topic_title
              };
              break;
          }
          messages.push(message);
        });
        return messages;
      }
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
