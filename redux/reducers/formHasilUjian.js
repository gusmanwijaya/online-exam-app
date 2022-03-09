import { SET_FORM_HASIL_UJIAN } from "../types";

const initialState = {
  form: {
    jadwalUjian: "",
    mahasiswa: "",
    listJawaban: "",
    jumlahBenar: 0,
    nilai: 0,
    masuk: "",
    selesai: "",
  },
};

const formHasilUjian = (state = initialState, action) => {
  switch (action.type) {
    case SET_FORM_HASIL_UJIAN:
      return {
        ...state,
        form: {
          ...state.form,
          [action.formType]: action.formValue,
        },
      };
    default:
      return state;
  }
};

export default formHasilUjian;
