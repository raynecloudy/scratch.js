import { default as fetch } from "node-fetch";

let credentials = {
  token: null,
  username: null
};

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
    credentials.token = data.token;
    credentials.username = data.username;
    resolve("Logged in successfully");
  } else {
    reject(data.msg);
  }
});

export const logout = async () => {
  if (!token) return;
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
  credentials.token = null;
  credentials.username = null;
};
