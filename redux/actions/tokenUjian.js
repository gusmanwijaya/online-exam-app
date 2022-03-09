import { GET_TOKEN_UJIAN } from "../types";

export const setDataTokenUjian = (payload) => (dispatch) => {
  return dispatch({
    type: GET_TOKEN_UJIAN,
    payload,
  });
};
