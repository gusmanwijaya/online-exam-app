import CallApi from "../config/api";

const ROOT_API = process.env.NEXT_PUBLIC_API;
const API = "api";

export async function getJadwalUjian() {
  const url = `${ROOT_API}/${API}/jadwal-ujian`;
  return CallApi({ url, method: "GET", token: true });
}

export async function getDetailJadwalUjian(idUjian) {
  const url = `${ROOT_API}/${API}/jadwal-ujian/${idUjian}`;
  return CallApi({ url, method: "GET", token: true });
}

export async function getTokenUjian(idUjian, token) {
  const url = `${ROOT_API}/${API}/token-ujian?idUjian=${idUjian}&token=${token}`;
  return CallApi({ url, method: "GET", token: true });
}

export async function getSoalUjian(idUjian) {
  const url = `${ROOT_API}/${API}/soal-ujian?idUjian=${idUjian}`;
  return CallApi({ url, method: "GET", token: true });
}

export async function getOneSoalUjian(idSoal) {
  const url = `${ROOT_API}/${API}/one-soal-ujian?q=${idSoal}`;
  return CallApi({ url, method: "GET", token: true });
}

export async function postHasilUjian(data) {
  const url = `${ROOT_API}/${API}/hasil-ujian`;
  return CallApi({ url, method: "POST", data, token: true });
}

export async function getHasilUjian(idMahasiswa) {
  const url = `${ROOT_API}/${API}/hasil-ujian?idMahasiswa=${idMahasiswa}`;
  return CallApi({ url, method: "GET", token: true });
}
