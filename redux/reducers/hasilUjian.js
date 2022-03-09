import { GET_HASIL_UJIAN } from "../types";

const initialState = {
  dataHasilUjian: {},
};

const hasilUjian = (state = initialState, action) => {
  switch (action.type) {
    case GET_HASIL_UJIAN:
      return {
        ...state,
        dataHasilUjian: action.payload,
      };
    default:
      return state;
  }
};

export default hasilUjian;
