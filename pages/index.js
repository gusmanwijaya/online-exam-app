import AOS from "aos";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Header from "../components/Header";
import { setLogin } from "../services/auth";

export default function SignIn() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    if (email === "") return toast.error("Email tidak boleh kosong!");
    if (password === "") return toast.error("Password tidak boleh kosong!");
    const data = {
      email,
      password,
    };
    const response = await setLogin(data);
    if (response.data.status === "error")
      return toast.error(response.data.message);
    const token = response.data.data.token;
    Cookies.set(
      Buffer.from("tkn", "utf-8").toString("base64"),
      Buffer.from(token, "utf-8").toString("base64"),
      {
        expires: 1,
      }
    );
    router.push("/mahasiswa/dashboard");
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <>
      <Header title="Sign In" />
      <div className="flex lg:flex-row flex-col items-center lg:py-12 py-0">
        <div className="w-full lg:w-1/2 text-center justify-center items-center flex lg:mb-0 -mb-10">
          <Image
            src="/img/welcome.svg"
            width={600}
            height={600}
            alt="Workflow"
            data-aos="zoom-in"
          />
        </div>

        <div className="lg:w-1/2 w-full flex flex-col items-center text-center">
          <h1 className="text-4xl text-gray-900 mb-6 mt-6 px-6 lg:px-0">
            Website <span className="text-primary">Ujian Online</span>
          </h1>

          <form className="space-y-4 w-full px-12 mb-12">
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Alamat Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered input-primary"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Kata Sandi</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered input-primary"
                onChange={(event) => setPassword(event.target.value)}
                value={password}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={onSubmit}
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
      <ToastContainer theme="colored" autoClose={2500} />
    </>
  );
}

export async function getServerSideProps({ req }) {
  const { dGtu } = req.cookies;
  if (dGtu)
    return {
      redirect: {
        destination: "/mahasiswa/dashboard",
        permanent: false,
      },
    };

  return {
    props: {},
  };
}
