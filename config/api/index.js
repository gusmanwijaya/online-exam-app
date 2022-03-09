import axios from "axios";
import Cookies from "js-cookie";

export default async function CallApi({
  url,
  method,
  data,
  token,
  serverToken,
}) {
  let headers = {};

  if (serverToken) {
    headers = {
      Authorization: `Bearer ${serverToken}`,
    };
  } else if (token) {
    const tknBase64 = Buffer.from("tkn", "utf-8").toString("base64");
    const tokenCookies = Cookies.get(tknBase64);
    if (tokenCookies) {
      const jwtToken = Buffer.from(tokenCookies, "base64").toString("utf-8");
      headers = {
        Authorization: `Bearer ${jwtToken}`,
      };
    }
  }

  const response = await axios({
    url,
    method,
    data,
    headers,
  }).catch((error) => error.response);

  return response;
}
