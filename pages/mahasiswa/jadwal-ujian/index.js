import AOS from "aos";
import { useEffect } from "react";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";
import Link from "next/link";
import Image from "next/image";
import jwtDecode from "jwt-decode";
import { useSelector, useDispatch } from "react-redux";
import { setDataJadwalUjian, setDataHasilUjian } from "../../../redux/actions";
import dateAndTime from "date-and-time";

export default function JadwalUjian({ mahasiswa }) {
  const dispatch = useDispatch();
  const { dataJadwalUjian } = useSelector((state) => state.jadwalUjian);
  const { dataHasilUjian } = useSelector((state) => state.hasilUjian);

  useEffect(() => {
    AOS.init();
    dispatch(setDataJadwalUjian());
    dispatch(setDataHasilUjian(mahasiswa?._id));
  }, [dispatch, mahasiswa?._id]);

  return (
    <>
      <Header title="Jadwal Ujian" />
      <div className="min-h-full">
        <Navbar current="Jadwal Ujian" mahasiswa={mahasiswa} />

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Jadwal Ujian</h1>
          </div>
        </header>
        <main data-aos="zoom-in">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0">
              {dataJadwalUjian.length > 0 ? (
                <>
                  <div className="alert alert-info shadow-lg mb-4 lg:mb-6">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-16 h-16 lg:w-6 lg:h-6 mx-2 stroke-current text-slate-200"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      <span className="text-slate-200">
                        Silahkan ikuti ujian yang ada dengan tepat waktu, jika
                        Anda terlambat tidak dapat mengikuti ujian!
                      </span>
                    </div>
                  </div>

                  {/* START: Table Desktop */}
                  <div className="hidden lg:flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-slate-100">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Mata Kuliah
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Nama
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Mulai
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Terlambat
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                  <span className="sr-only">Mulai</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {dataJadwalUjian.map((value, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {value?.mataKuliah?.nama}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {value?.namaUjian}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {value?.mulaiUjian}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {value?.terlambatUjian}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    {value?._id ===
                                    dataHasilUjian?.jadwalUjian?._id ? (
                                      <span className="text-green-600">
                                        Selesai
                                      </span>
                                    ) : new Date() >
                                      dateAndTime.parse(
                                        value?.terlambatUjian,
                                        "DD-MM-YYYY HH:mm"
                                      ) ? (
                                      <span className="text-error">
                                        Terlambat
                                      </span>
                                    ) : (
                                      <Link
                                        href={`/mahasiswa/jadwal-ujian/${value?._id}`}
                                      >
                                        <a
                                          type="button"
                                          className="text-indigo-600 hover:text-indigo-900"
                                        >
                                          Mulai
                                        </a>
                                      </Link>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* END: Table Desktop */}

                  {/* START: Table Mobile */}
                  <div className="block lg:hidden">
                    <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg">
                      <div className="border-gray-200">
                        {dataJadwalUjian.map((value, index) => (
                          <dl key={index}>
                            <div className="bg-slate-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">
                                Mata Kuliah
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value?.mataKuliah?.nama}
                              </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">
                                Nama
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value?.namaUjian}
                              </dd>
                            </div>
                            <div className="bg-slate-100 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">
                                Mulai
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value?.mulaiUjian}
                              </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">
                                Terlambat
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value?.terlambatUjian}
                              </dd>
                            </div>
                            <div className="bg-slate-100 px-4 py-5">
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 text-center">
                                {value?._id ===
                                dataHasilUjian?.jadwalUjian?._id ? (
                                  <span className="text-green-600">
                                    Selesai
                                  </span>
                                ) : new Date() >
                                  dateAndTime.parse(
                                    value?.terlambatUjian,
                                    "DD-MM-YYYY HH:mm"
                                  ) ? (
                                  <span className="text-error">Terlambat</span>
                                ) : (
                                  <Link
                                    href={`/mahasiswa/jadwal-ujian/${value?._id}`}
                                  >
                                    <a
                                      type="button"
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      Mulai
                                    </a>
                                  </Link>
                                )}
                              </dd>
                            </div>
                          </dl>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* END: Table Mobile */}
                </>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <Image
                    src="/img/empty.svg"
                    width={450}
                    height={450}
                    alt="Empty Data"
                  />
                  <p className="text-center font-light lg:-mt-12 px-8 lg:px-0">
                    Ooppss, nampaknya Anda tidak memiliki jadwal ujian.
                  </p>
                </div>
              )}
            </div>
            {/* /End replace */}
          </div>
        </main>
      </div>
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
    },
  };
}
