import { SAVE_JAWABAN_MAHASISWA } from "../types";

const initialState = {
  dataJawabanMahasiswa: {},
};

const jawabanMahasiswa = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_JAWABAN_MAHASISWA:
      return {
        ...state,
        dataJawabanMahasiswa: action.payload,
      };
    default:
      return state;
  }
};

export default jawabanMahasiswa;
