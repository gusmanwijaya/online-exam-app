import { combineReducers } from "redux";
import jadwalUjian from "./jadwalUjian";
import detailJadwalUjian from "./detailJadwalUjian";
import soalUjian from "./soalUjian";
import oneSoalUjian from "./oneSoalUjian";
import formHasilUjian from "./formHasilUjian";
import hasilUjian from "./hasilUjian";

const reducers = combineReducers({
  jadwalUjian,
  detailJadwalUjian,
  soalUjian,
  oneSoalUjian,
  formHasilUjian,
  hasilUjian,
});

export default reducers;
