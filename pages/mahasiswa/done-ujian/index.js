import Image from "next/image";
import Header from "../../../components/Header";
import { useEffect, useState, useRef } from "react";
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

export default function DoneUjian({
  mahasiswa,
  jawabanMahasiswa,
  detailJadwalUjian,
  tokenUjian,
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { form } = useSelector((state) => state.formHasilUjian);
  const { dataHasilUjian } = useSelector((state) => state.hasilUjian);

  const [jumlahBenar, setJumlahBenar] = useState(0);
  const [nilai, setNilai] = useState(0);
  const [tampilkanNilai, setTampilkanNilai] = useState(0);
  const [soalUjian, setSoalUjian] = useState([]);

  // START: Hitung Jawaban Benar & Nilai
  let arrayJumlahBenar = [];
  let countNilai = 0;

  if (Object.keys(jawabanMahasiswa).length > 0 && soalUjian.length > 0) {
    jawabanMahasiswa?.data.forEach((jwbMhs) => {
      soalUjian.forEach((soal) => {
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
    if (localStorage.getItem("frm")) {
      const newFormLocalStorage = JSON.parse(
        Buffer.from(localStorage.getItem("frm"), "base64").toString("utf-8")
      );
      const response = await postHasilUjian(newFormLocalStorage);
      if (response?.data?.status === "error") {
        toast.error(response?.data?.message);
      } else {
        toast.success("Hasil ujian berhasil disimpan!");
        localStorage.clear();
        Cookies.remove("dn");
        Cookies.remove("ct");
        Cookies.remove("jm");
        Cookies.remove("dju");
        Cookies.remove("tu");
        router.push("/mahasiswa/jadwal-ujian");
      }
    }
  };

  if (form?.nilai !== 0 && Object.keys(form).length >= 7) {
    localStorage.setItem(
      "frm",
      Buffer.from(JSON.stringify(form), "utf-8").toString("base64")
    );
  }

  useEffect(() => {
    dispatch(setDataHasilUjian(mahasiswa?._id));
    if (Object.keys(dataHasilUjian).length > 0)
      return router.push("/mahasiswa/jadwal-ujian");

    if (arrayJumlahBenar.length > 0) {
      setJumlahBenar(arrayJumlahBenar.length);
    }

    if (countNilai > 0) {
      setNilai(countNilai);
      localStorage.setItem(
        "nli",
        Buffer.from(countNilai.toString(), "utf-8").toString("base64")
      );
    }

    if (localStorage.getItem("nli")) {
      setTampilkanNilai(
        parseInt(
          Buffer.from(localStorage.getItem("nli"), "base64").toString("utf-8")
        )
      );
    }

    if (localStorage.getItem("slu")) {
      setSoalUjian(
        JSON.parse(
          Buffer.from(localStorage.getItem("slu"), "base64").toString("utf-8")
        )
      );
    }

    dispatch(setFormPostHasilUjian("jadwalUjian", detailJadwalUjian?._id));
    dispatch(setFormPostHasilUjian("mahasiswa", mahasiswa?._id));
    dispatch(
      setFormPostHasilUjian(
        "listJawaban",
        JSON.stringify(jawabanMahasiswa?.data)
      )
    );
    dispatch(setFormPostHasilUjian("jumlahBenar", jumlahBenar));
    dispatch(setFormPostHasilUjian("nilai", nilai));
    dispatch(setFormPostHasilUjian("masuk", tokenUjian?.waktuMulai));
    dispatch(setFormPostHasilUjian("selesai", jawabanMahasiswa?.waktuSelesai));
  }, [
    dataHasilUjian,
    router,
    dispatch,
    detailJadwalUjian?._id,
    jawabanMahasiswa?.data,
    jawabanMahasiswa?.waktuSelesai,
    tokenUjian?.waktuMulai,
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
            Nilai ujian Anda : {tampilkanNilai}
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

  const jm = req.cookies.jm;
  const jawabanMahasiswa = JSON.parse(
    Buffer.from(jm, "base64").toString("utf-8")
  );

  const dju = req.cookies.dju;
  const detailJadwalUjian = JSON.parse(
    Buffer.from(dju, "base64").toString("utf-8")
  );
  const tu = req.cookies.tu;
  const tokenUjian = JSON.parse(Buffer.from(tu, "base64").toString("utf-8"));
  return {
    props: {
      mahasiswa,
      jawabanMahasiswa,
      detailJadwalUjian,
      tokenUjian,
    },
  };
}
