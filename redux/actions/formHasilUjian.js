import { SET_FORM_HASIL_UJIAN } from "../types";

export const setFormPostHasilUjian = (formType, formValue) => {
  return {
    type: SET_FORM_HASIL_UJIAN,
    formType,
    formValue,
  };
};
