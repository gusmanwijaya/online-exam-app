import { getJadwalUjian } from "../../services/mahasiswa";
import { GET_JADWAL_UJIAN } from "../types";

export const setDataJadwalUjian = () => async (dispatch) => {
  const response = await getJadwalUjian();
  if (response?.data?.status === "success")
    return dispatch({
      type: GET_JADWAL_UJIAN,
      payload: response?.data?.data,
    });
};
