import { GET_DETAIL_JADWAL_UJIAN } from "../types";
import { getDetailJadwalUjian } from "../../services/mahasiswa";

export const setDataDetailJadwalUjian = (idUjian) => async (dispatch) => {
  const response = await getDetailJadwalUjian(idUjian);
  if (response?.data?.status === "success")
    return dispatch({
      type: GET_DETAIL_JADWAL_UJIAN,
      payload: response?.data?.data,
    });
};
