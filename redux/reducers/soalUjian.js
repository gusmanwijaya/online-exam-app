import { GET_SOAL_UJIAN } from "../types";

const initialState = {
  dataSoalUjian: [],
};

const soalUjian = (state = initialState, action) => {
  switch (action.type) {
    case GET_SOAL_UJIAN:
      return {
        ...state,
        dataSoalUjian: action.payload,
      };

    default:
      return state;
  }
};

export default soalUjian;
