import { GET_ONE_SOAL_UJIAN } from "../types";

const initialState = {
  dataOneSoalUjian: {},
};

const oneSoalUjian = (state = initialState, action) => {
  switch (action.type) {
    case GET_ONE_SOAL_UJIAN:
      return {
        ...state,
        dataOneSoalUjian: action.payload,
      };
    default:
      return state;
  }
};

export default oneSoalUjian;
