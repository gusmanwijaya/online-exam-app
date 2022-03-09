import CallApi from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;
const API = "api";

export async function setLogin(data) {
  const url = `${ROOT_API}/${API}/sign-in`;
  return CallApi({ url, method: "POST", data });
}
