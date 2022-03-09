import AOS from "aos";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import Header from "../../../components/Header";
import Navbar from "../../../components/Navbar";

export default function Dashboard({ mahasiswa }) {
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <Header title="Dashboard" />
      <div className="min-h-full">
        <Navbar current="Dashboard" mahasiswa={mahasiswa} />

        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-24">
            {/* Replace with your content */}
            <div className="px-4 py-6 sm:px-0" data-aos="zoom-in">
              <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Data Pribadi Mahasiswa
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Silahkan periksa data pribadi Anda, jika terdapat data yang
                    tidak sesuai, segera hubungi Admin!
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Nama lengkap
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {mahasiswa.nama}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">NPM</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {mahasiswa.npm}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Email address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {mahasiswa.email}
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Jenis kelamin
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {mahasiswa.jenisKelamin === "L"
                          ? "Laki-laki"
                          : "Perempuan"}
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Program studi
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {mahasiswa.programStudi}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
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
