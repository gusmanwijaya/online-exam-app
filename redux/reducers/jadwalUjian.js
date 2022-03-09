import { GET_JADWAL_UJIAN } from "../types";

const initialState = {
  dataJadwalUjian: [],
};

const jadwalUjian = (state = initialState, action) => {
  switch (action.type) {
    case GET_JADWAL_UJIAN:
      return {
        ...state,
        dataJadwalUjian: action.payload,
      };
    default:
      return state;
  }
};

export default jadwalUjian;
