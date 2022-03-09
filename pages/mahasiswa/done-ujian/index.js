import Image from "next/image";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataHasilUjian,
  setFormPostHasilUjian,
} from "../../../redux/actions";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { postHasilUjian } from "../../../services/mahasiswa";

export default function DoneUjian({ mahasiswa }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { dataJawabanMahasiswa } = useSelector(
    (state) => state.jawabanMahasiswa
  );
  const { dataDetailJadwalUjian } = useSelector(
    (state) => state.detailJadwalUjian
  );
  const { dataTokenUjian } = useSelector((state) => state.tokenUjian);
  const { dataSoalUjian } = useSelector((state) => state.soalUjian);
  const { form } = useSelector((state) => state.formHasilUjian);
  const { dataHasilUjian } = useSelector((state) => state.hasilUjian);

  const [jumlahBenar, setJumlahBenar] = useState(0);
  const [nilai, setNilai] = useState(0);

  // START: Hitung Jawaban Benar & Nilai
  let arrayJumlahBenar = [];
  let countNilai = 0;

  if (
    Object.keys(dataJawabanMahasiswa).length > 0 &&
    dataSoalUjian.length > 0
  ) {
    dataJawabanMahasiswa?.data.forEach((jwbMhs) => {
      dataSoalUjian.forEach((soal) => {
        if (
          jwbMhs?.idSoal === soal?._id &&
          jwbMhs?.jawaban === soal?.kunciJawaban?.message
        ) {
          arrayJumlahBenar.push({
            idSoal: soal?._id,
            isTrue: true,
          });
          countNilai += soal?.bobot;
        }
      });
    });
  }
  // END: Hitung Jawaban Benar & Nilai

  const onSubmit = async () => {
    const response = await postHasilUjian(form);
    if (response?.data?.status === "error")
      return toast.error(response?.data?.message);
    toast.success("Hasil ujian berhasil disimpan!");
    localStorage.clear();
    Cookies.remove("dn");
    router.push("/mahasiswa/jadwal-ujian");
  };

  useEffect(() => {
    dispatch(setDataHasilUjian(mahasiswa?._id));
    if (Object.keys(dataHasilUjian).length > 0)
      return router.push("/mahasiswa/jadwal-ujian");

    if (arrayJumlahBenar.length > 0) {
      setJumlahBenar(arrayJumlahBenar.length);
    }

    if (countNilai > 0) {
      setNilai(countNilai);
    }

    dispatch(setFormPostHasilUjian("jadwalUjian", dataDetailJadwalUjian?._id));
    dispatch(setFormPostHasilUjian("mahasiswa", mahasiswa?._id));
    dispatch(
      setFormPostHasilUjian(
        "listJawaban",
        JSON.stringify(dataJawabanMahasiswa?.data)
      )
    );
    dispatch(setFormPostHasilUjian("jumlahBenar", jumlahBenar));
    dispatch(setFormPostHasilUjian("nilai", nilai));
    dispatch(setFormPostHasilUjian("masuk", dataTokenUjian?.waktuMulai));
    dispatch(
      setFormPostHasilUjian("selesai", dataJawabanMahasiswa?.waktuSelesai)
    );
  }, [
    dataHasilUjian,
    router,
    dispatch,
    dataDetailJadwalUjian?._id,
    dataJawabanMahasiswa?.data,
    dataJawabanMahasiswa?.waktuSelesai,
    dataTokenUjian?.waktuMulai,
    mahasiswa?._id,
    arrayJumlahBenar.length,
    countNilai,
    jumlahBenar,
    nilai,
  ]);

  return (
    <>
      <Header title="Selamat, ujian telah selesai!" />
      <section className="h-screen flex flex-col items-center justify-center">
        <Image
          src="/img/done.svg"
          width={450}
          height={450}
          alt="Selamat, ujian telah selesai!"
        />
        <h1 className="text-3xl text-gray-900 my-4 text-center">
          Selamat, ujian telah selesai! <br />
          <span className="text-base text-gray-400">
            Jangan lupa tekan tombol simpan untuk menyimpan hasil ujian. <br />
            Nilai ujian Anda : {form?.nilai}
          </span>{" "}
        </h1>
        <button
          type="button"
          onClick={onSubmit}
          className="btn btn-primary my-10"
        >
          Simpan
        </button>
      </section>
      <ToastContainer theme="colored" autoClose={2500} />
    </>
  );
}

export async function getServerSideProps({ req }) {
  const tkn = req.cookies.dGtu;
  if (!tkn)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const su = req.cookies.su;
  if (su) {
    const lnk = req.cookies.lnk;
    const link = JSON.parse(Buffer.from(lnk, "base64").toString("utf-8"));
    return {
      redirect: {
        destination: link,
        permanent: false,
      },
    };
  }

  const dn = req.cookies.dn;
  if (!dn)
    return {
      redirect: {
        destination: "/mahasiswa/jadwal-ujian",
        permanent: false,
      },
    };

  const jwtToken = Buffer.from(tkn, "base64").toString("utf-8");
  const payload = jwtDecode(jwtToken);
  const mahasiswa = payload.mahasiswa;
  return {
    props: {
      mahasiswa,
    },
  };
}
