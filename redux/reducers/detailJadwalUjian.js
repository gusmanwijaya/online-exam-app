import { GET_DETAIL_JADWAL_UJIAN } from "../types";

const initialState = {
  dataDetailJadwalUjian: [],
};

const detailJadwalUjian = (state = initialState, action) => {
  switch (action.type) {
    case GET_DETAIL_JADWAL_UJIAN:
      return {
        ...state,
        dataDetailJadwalUjian: action.payload,
      };
    default:
      return state;
  }
};

export default detailJadwalUjian;
