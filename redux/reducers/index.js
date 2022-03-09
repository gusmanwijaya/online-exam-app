import { combineReducers } from "redux";
import jadwalUjian from "./jadwalUjian";
import detailJadwalUjian from "./detailJadwalUjian";
import tokenUjian from "./tokenUjian";
import soalUjian from "./soalUjian";
import oneSoalUjian from "./oneSoalUjian";
import jawabanMahasiswa from "./jawabanMahasiswa";
import formHasilUjian from "./formHasilUjian";
import hasilUjian from "./hasilUjian";

const reducers = combineReducers({
  jadwalUjian,
  detailJadwalUjian,
  tokenUjian,
  soalUjian,
  oneSoalUjian,
  jawabanMahasiswa,
  formHasilUjian,
  hasilUjian,
});

export default reducers;
