import AOS from "aos";
import { useEffect, useState } from "react";
import Header from "../../../../components/Header";
import Navbar from "../../../../components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import {
  setDataDetailJadwalUjian,
  setDataHasilUjian,
  setDataSoalUjian,
  setDataTokenUjian,
} from "../../../../redux/actions";
import { getTokenUjian } from "../../../../services/mahasiswa";
import dateAndTime from "date-and-time";

export default function DetailJadwalUjian({ mahasiswa, params }) {
  const idUjian = params.idJadwal;
  const router = useRouter();
  const dispatch = useDispatch();

  const { dataDetailJadwalUjian } = useSelector(
    (state) => state.detailJadwalUjian
  );
  const { dataSoalUjian } = useSelector((state) => state.soalUjian);
  const { dataHasilUjian } = useSelector((state) => state.hasilUjian);

  const [token, setToken] = useState("");

  useEffect(() => {
    AOS.init();
    dispatch(setDataDetailJadwalUjian(idUjian));
    dispatch(setDataSoalUjian(idUjian));
    dispatch(setDataHasilUjian(mahasiswa?._id));

    if (Object.keys(dataHasilUjian).length > 0)
      return router.push("/mahasiswa/jadwal-ujian");
  }, [dispatch, idUjian, mahasiswa?._id, dataHasilUjian, router]);

  const onSubmit = async () => {
    if (token === "")
      return toast.error("Silahkan masukkan token untuk mengikuti ujian!");
    if (token !== dataDetailJadwalUjian?.token)
      return toast.error("Token yang Anda miliki tidak sesuai!");
    const response = await getTokenUjian(idUjian, token);
    if (response?.data?.status === "error")
      return toast.error(response?.data?.message);
    const waktuMulai = dateAndTime.format(new Date(), "DD-MM-YYYY HH:mm");
    const payload = {
      waktuMulai,
      data: response?.data?.data,
    };
    dispatch(setDataTokenUjian(payload));
    toast.success("Selamat mengerjakan ujian!");
    Cookies.set("su", true);
    Cookies.set(
      "lnk",
      Buffer.from(
        JSON.stringify(`/mahasiswa/do-the-exam?i=0&q=${dataSoalUjian[0]?._id}`),
        "utf-8"
      ).toString("base64")
    );
    router.push(`/mahasiswa/do-the-exam?i=0&q=${dataSoalUjian[0]?._id}`);
  };

  return (
    <>
      <Header title="Jadwal Ujian" />
      <div className="min-h-full">
        <Navbar current="Jadwal Ujian" mahasiswa={mahasiswa} />

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Detail Jadwal Ujian
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-24">
            {/* Replace with your content */}
            <div className="px-4 sm:px-0" data-aos="zoom-in">
              <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Detail Informasi Mengenai Ujian
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Silahkan masukkan token yang Anda miliki untuk memulai
                    ujian!
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-slate-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Mata Kuliah
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {dataDetailJadwalUjian?.mataKuliah?.nama}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Dosen
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {dataDetailJadwalUjian?.dosen?.nama}
                      </dd>
                    </div>
                    <div className="bg-slate-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Nama Ujian
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {dataDetailJadwalUjian?.namaUjian}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Jumlah Soal
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {dataDetailJadwalUjian?.jumlahSoal}
                      </dd>
                    </div>
                    <div className="bg-slate-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Durasi Ujian
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {dataDetailJadwalUjian?.durasiUjian} Menit
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Mulai Ujian
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {dataDetailJadwalUjian?.mulaiUjian}
                      </dd>
                    </div>
                    <div className="bg-slate-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Terlambat Ujian
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {dataDetailJadwalUjian?.terlambatUjian}
                      </dd>
                    </div>
                    <form>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">
                          Token
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <input
                            type="text"
                            name="token"
                            className="input input-bordered input-primary w-full"
                            onChange={(event) => setToken(event.target.value)}
                            value={token}
                          />
                        </dd>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary w-full"
                        onClick={onSubmit}
                      >
                        Mulai
                      </button>
                    </form>
                  </dl>
                </div>
              </div>
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
      <ToastContainer theme="colored" autoClose={2500} />
    </>
  );
}

export async function getServerSideProps({ req, params }) {
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
  if (dn)
    return {
      redirect: {
        destination: "/mahasiswa/done-ujian",
        permanent: false,
      },
    };

  const jwtToken = Buffer.from(tkn, "base64").toString("utf-8");
  const payload = jwtDecode(jwtToken);
  const mahasiswa = payload.mahasiswa;
  return {
    props: {
      mahasiswa,
      params,
    },
  };
}
