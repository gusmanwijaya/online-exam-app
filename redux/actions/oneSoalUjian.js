import { getOneSoalUjian } from "../../services/mahasiswa";
import { GET_ONE_SOAL_UJIAN } from "../types";

export const setDataOneSoalUjian = (idSoal) => async (dispatch) => {
  const response = await getOneSoalUjian(idSoal);
  if (response?.data?.status === "success")
    return dispatch({
      type: GET_ONE_SOAL_UJIAN,
      payload: response?.data?.data,
    });
};
