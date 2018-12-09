// https://daveceddia.com/multiple-environments-with-react/
let backendUrl;
let prod = false;

const hostname = window && window.location && window.location.hostname;

if (hostname === "mewna.com") {
  backendUrl = "https://esp.mewna.com";
  prod = true;
} else if (hostname === "mewna.app") {
  backendUrl = "https://esp.mewna.app";
  prod = true;
} else if (hostname === "v2.mewna.app") {
  backendUrl = "https://esp-v2.mewna.app";
  prod = true;
} else {
  backendUrl = process.env.REACT_APP_BACKEND_URL;
}

export const BACKEND_URL = backendUrl; // process.env.REACT_APP_BACKEND_URL
export const DISCORD_EPOCH = 1420070400000;
export const MEWNA_EPOCH = 1518566400000;
export const PROD = prod;

export const BLURPLE = "#7289DA";
export const REDPLE = "#DB325C";
export const GREYPLE = "#565b6b";
export const FULL_WHITE = "#FFFFFF";
export const DARK_NOT_BLACK = "#2C2F33";
export const NOT_QUITE_BLACK = "#23272A";
