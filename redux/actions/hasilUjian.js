import { getHasilUjian } from "../../services/mahasiswa";
import { GET_HASIL_UJIAN } from "../types";

export const setDataHasilUjian = (idMahasiswa) => async (dispatch) => {
  const response = await getHasilUjian(idMahasiswa);
  if (response?.data?.status === "success")
    return dispatch({
      type: GET_HASIL_UJIAN,
      payload: response?.data?.data,
    });
};
