import { SAVE_JAWABAN_MAHASISWA } from "../types";

export const setDataJawabanMahasiswa = (payload) => (dispatch) => {
  return dispatch({
    type: SAVE_JAWABAN_MAHASISWA,
    payload,
  });
};
