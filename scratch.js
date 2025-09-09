import { default as fetch } from "node-fetch";

export const login = (username, password) => new Promise(async (resolve, reject) => {
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
    resolve(new Credentials(data.token, data.username));
  } else {
    reject(data.msg);
  }
});

class Credentials {
  token = null;
  username = null;

  constructor(token, username) {
    this.token = token;
    this.username = username;
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
    this.username = null;
  };
}
