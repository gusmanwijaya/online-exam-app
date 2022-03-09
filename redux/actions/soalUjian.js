import { getSoalUjian } from "../../services/mahasiswa";
import { GET_SOAL_UJIAN } from "../types";

export const setDataSoalUjian = (idUjian) => async (dispatch) => {
  const response = await getSoalUjian(idUjian);
  if (response?.data?.status === "success")
    return dispatch({
      type: GET_SOAL_UJIAN,
      payload: response?.data?.data,
    });
};
