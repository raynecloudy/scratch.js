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
      "username": username,
      "password": password
    })
  });
  const data = (await response.json())[0];

  if (response.ok) {
    resolve(new Session(data.token));
  } else {
    reject(data.msg);
  }
});

export class Session {
  token = null;

  constructor(token) {
    this.token = token;
  }

  logout = async () => {
    if (!this.token) return;
    await fetch("https://scratch.mit.edu/accounts/logout/", {
      credentials: "include",
      method: "POST",
      headers: {
        "Cookie": "scratchcsrftoken=scratchjs; scratchlanguage=en",
        "Origin": "https://scratch.mit.edu",
        "Referer": "https://scratch.mit.edu/",
        "X-CSRFToken": "scratchjs",
        "X-Requested-With": "application/x-www-form-urlencoded",
        "Content-Type": "application/json"
      }
    });
    this.token = null;
  };
}
