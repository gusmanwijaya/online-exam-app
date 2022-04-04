/* eslint-disable @next/next/no-img-element */
import AOS from "aos";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSelector, useDispatch } from "react-redux";
import dateAndTime from "date-and-time";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import { setDataHasilUjian, setDataOneSoalUjian } from "../../../redux/actions";

export default function DoTheExam({
  queryIndex,
  queryParams,
  mahasiswa,
  menitUjian,
}) {
  const API_IMG_SOAL = process.env.NEXT_PUBLIC_IMG_SOAL;
  const API_IMG_PILIHAN = process.env.NEXT_PUBLIC_IMG_PILIHAN;

  const [radio, setRadio] = useState("");
  const [soalUjian, setSoalUjian] = useState([]);

  const router = useRouter();
  const dispatch = useDispatch();

  const { dataOneSoalUjian } = useSelector((state) => state.oneSoalUjian);
  const { dataHasilUjian } = useSelector((state) => state.hasilUjian);

  const minuteSeconds = 60;
  const hourSeconds = minuteSeconds * 60;
  const daySeconds = hourSeconds * 24;

  const timerProps = {
    isPlaying: true,
    size: 120,
    strokeWidth: 6,
  };

  const renderTime = (dimension, time) => {
    return (
      <div className="time-wrapper">
        <div className="time">{time}</div>
        <div>{dimension}</div>
      </div>
    );
  };

  const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
  const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
  const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
  // const getTimeDays = (time) => (time / daySeconds) | 0;

  const stratTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = stratTime + menitUjian * 60;

  const remainingTime = endTime - stratTime;
  // const days = Math.ceil(remainingTime / daySeconds);
  // const daysDuration = days * daySeconds;

  useEffect(() => {
    if (localStorage.getItem("slu")) {
      const soalLocalStorage = JSON.parse(
        Buffer.from(localStorage.getItem("slu"), "base64").toString("utf-8")
      );
      setSoalUjian(soalLocalStorage);
    }

    dispatch(setDataHasilUjian(mahasiswa?._id));
    if (Object.keys(dataHasilUjian).length > 0)
      return router.push("/mahasiswa/jadwal-ujian");

    if (localStorage.getItem(queryParams)) {
      const objData = JSON.parse(
        Buffer.from(localStorage.getItem(queryParams), "base64").toString(
          "utf-8"
        )
      );
      if (objData?.idSoal !== "" && objData?.jawaban !== "") {
        dispatch(setDataOneSoalUjian(objData?.idSoal));
        setRadio(objData?.jawaban);
      }
    }

    AOS.init();
    dispatch(setDataOneSoalUjian(queryParams));
  }, [dispatch, queryParams, mahasiswa?._id, dataHasilUjian, router]);

  const onEnd = (remainingTime, totalElapsedTime) => {
    if (
      remainingTime - totalElapsedTime < hourSeconds &&
      remainingTime - totalElapsedTime < minuteSeconds
    ) {
      Cookies.remove("su");
      Cookies.remove("lnk");

      const dateNow = dateAndTime.format(new Date(), "DD-MM-YYYY HH:mm");
      let array = [];

      soalUjian.forEach((soal) => {
        if (localStorage.getItem(soal?._id))
          return array.push(
            JSON.parse(
              Buffer.from(localStorage.getItem(soal?._id), "base64").toString(
                "utf-8"
              )
            )
          );
      });

      let payload = {
        waktuSelesai: dateNow,
        data: array,
      };
      Cookies.set(
        "jm",
        Buffer.from(JSON.stringify(payload), "utf-8").toString("base64")
      );
      Cookies.set("dn", true);
      router.push("/mahasiswa/done-ujian");
    }
  };

  const onNavigasiSoal = (value, index) => {
    router.push(`/mahasiswa/do-the-exam?i=${index}&q=${value}`);
    dispatch(setDataOneSoalUjian(value));
    if (!localStorage.getItem(value)) return setRadio("");
  };

  const onSave = () => {
    let payload = {
      idSoal: queryParams,
      jawaban: radio,
    };
    localStorage.setItem(
      queryParams,
      Buffer.from(JSON.stringify(payload), "utf-8").toString("base64")
    );
    router.push(
      `/mahasiswa/do-the-exam?i=${
        soalUjian.length - 1 === queryIndex ? queryIndex : queryIndex + 1
      }&q=${
        soalUjian.length - 1 === queryIndex
          ? soalUjian[queryIndex]?._id
          : soalUjian[queryIndex + 1]?._id
      }`
    );
    if (queryIndex !== soalUjian.length - 1) return setRadio("");
  };

  const onDone = () => {
    confirmAlert({
      message: "Apakah kamu yakin telah menyelesaikan ujian?",
      closeOnClickOutside: false,
      buttons: [
        {
          label: "Ya",
          onClick: () => {
            Cookies.remove("su");
            Cookies.remove("lnk");

            const dateNow = dateAndTime.format(new Date(), "DD-MM-YYYY HH:mm");
            let array = [];

            soalUjian.forEach((soal) => {
              if (localStorage.getItem(soal?._id))
                return array.push(
                  JSON.parse(
                    Buffer.from(
                      localStorage.getItem(soal?._id),
                      "base64"
                    ).toString("utf-8")
                  )
                );
            });

            let payload = {
              waktuSelesai: dateNow,
              data: array,
            };
            Cookies.set(
              "jm",
              Buffer.from(JSON.stringify(payload), "utf-8").toString("base64")
            );
            Cookies.set("dn", true);
            router.push("/mahasiswa/done-ujian");
          },
        },
        {
          label: "Belum",
          onClick: () => console.log("Belum"),
        },
      ],
    });
  };

  const setSisaMenitUjian = (elapsedTime) => {
    Cookies.set("ct", getTimeMinutes(hourSeconds - elapsedTime).toString());
  };

  return (
    <>
      <Header title="Soal Ujian" />

      <div
        className="flex items-center justify-center px-5 py-5 space-x-2 lg:space-x-4"
        data-aos="fade-down"
      >
        {/* <CountdownCircleTimer
          {...timerProps}
          colors="#7E2E84"
          duration={daysDuration}
          initialRemainingTime={remainingTime}
        >
          {({ elapsedTime, color }) => (
            <span style={{ color }}>
              {renderTime("hari", getTimeDays(daysDuration - elapsedTime))}
            </span>
          )}
        </CountdownCircleTimer> */}
        <CountdownCircleTimer
          {...timerProps}
          colors="#D14081"
          duration={daySeconds}
          initialRemainingTime={remainingTime % daySeconds}
          onComplete={(totalElapsedTime) =>
            remainingTime - totalElapsedTime < hourSeconds
              ? onEnd(remainingTime, totalElapsedTime)
              : {
                  shouldRepeat: remainingTime - totalElapsedTime > hourSeconds,
                }
          }
        >
          {({ elapsedTime, color }) => (
            <span style={{ color }}>
              {renderTime("jam", getTimeHours(daySeconds - elapsedTime))}
            </span>
          )}
        </CountdownCircleTimer>
        <CountdownCircleTimer
          {...timerProps}
          colors="#EF798A"
          duration={hourSeconds}
          initialRemainingTime={remainingTime % hourSeconds}
          onComplete={(totalElapsedTime) =>
            remainingTime - totalElapsedTime < minuteSeconds
              ? onEnd(remainingTime, totalElapsedTime)
              : {
                  shouldRepeat:
                    remainingTime - totalElapsedTime > minuteSeconds,
                }
          }
        >
          {({ elapsedTime, color }) => {
            setSisaMenitUjian(elapsedTime);
            return (
              <span style={{ color }}>
                {renderTime("menit", getTimeMinutes(hourSeconds - elapsedTime))}
              </span>
            );
          }}
        </CountdownCircleTimer>
        <CountdownCircleTimer
          {...timerProps}
          colors="#218380"
          duration={minuteSeconds}
          initialRemainingTime={remainingTime % minuteSeconds}
          onComplete={(totalElapsedTime) => ({
            shouldRepeat: remainingTime - totalElapsedTime > 0,
          })}
        >
          {({ elapsedTime, color }) => (
            <span style={{ color }}>
              {renderTime("detik", getTimeSeconds(elapsedTime))}
            </span>
          )}
        </CountdownCircleTimer>
      </div>

      <div className="px-5 lg:px-96 py-5">
        <div className="card shadow-xl">
          <div className="card-body space-y-4">
            <h2 className="card-title justify-center">Navigasi Soal</h2>
            <div className="grid grid-cols-5 gap-4">
              {soalUjian.length > 0 &&
                soalUjian.map((value, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigasiSoal(value?._id, index)}
                    type="button"
                    className={
                      localStorage.getItem(value?._id)
                        ? "btn btn-accent btn-square btn-sm"
                        : index === queryIndex
                        ? "btn btn-primary btn-square btn-sm"
                        : "btn btn-outline btn-primary btn-square btn-sm"
                    }
                  >
                    {index + 1}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          dataOneSoalUjian?.soalGambar?.message !== ""
            ? "px-5 py-5"
            : "px-12 py-12"
        }
      >
        <div className="card card-bordered shadow-xl">
          {dataOneSoalUjian?.soalGambar?.message !== "" && (
            <figure>
              <img
                src={`${API_IMG_SOAL}/${dataOneSoalUjian?.soalGambar?.message}`}
                alt="Soal Gambar"
                className="w-full h-full md:w-1/2 md:h-1/2 pt-8 rounded-xl object-cover"
              />
            </figure>
          )}
          <div className="card-body">
            <h2 className="card-title">
              {queryIndex + 1}. {dataOneSoalUjian?.soal?.message}
            </h2>
            <div className="form-control flex flex-row justify-start items-center">
              <label className="cursor-pointer label space-x-4">
                <input
                  type="radio"
                  name="pilihan"
                  className="radio"
                  value="A"
                  onChange={(event) => setRadio(event.target.value)}
                  checked={radio === "A"}
                />
                <span className="label-text">
                  {dataOneSoalUjian?.pilihanA?.message}
                </span>
              </label>
            </div>
            {dataOneSoalUjian?.pilihanGambarA?.message !== "" && (
              <img
                src={`${API_IMG_PILIHAN}/${dataOneSoalUjian?.pilihanGambarA?.message}`}
                className="max-w-sm rounded-lg shadow"
                alt="Soal Gambar"
              />
            )}

            <div className="form-control flex flex-row justify-start items-center">
              <label className="cursor-pointer label space-x-4">
                <input
                  type="radio"
                  name="pilihan"
                  className="radio"
                  value="B"
                  onChange={(event) => setRadio(event.target.value)}
                  checked={radio === "B"}
                />
                <span className="label-text">
                  {dataOneSoalUjian?.pilihanB?.message}
                </span>
              </label>
            </div>
            {dataOneSoalUjian?.pilihanGambarB?.message !== "" && (
              <img
                src={`${API_IMG_PILIHAN}/${dataOneSoalUjian?.pilihanGambarB?.message}`}
                className="max-w-sm rounded-lg shadow"
                alt="Soal Gambar"
              />
            )}

            <div className="form-control flex flex-row justify-start items-center">
              <label className="cursor-pointer label space-x-4">
                <input
                  type="radio"
                  name="pilihan"
                  className="radio"
                  value="C"
                  onChange={(event) => setRadio(event.target.value)}
                  checked={radio === "C"}
                />
                <span className="label-text">
                  {dataOneSoalUjian?.pilihanC?.message}
                </span>
              </label>
            </div>
            {dataOneSoalUjian?.pilihanGambarC?.message !== "" && (
              <img
                src={`${API_IMG_PILIHAN}/${dataOneSoalUjian?.pilihanGambarC?.message}`}
                className="max-w-sm rounded-lg shadow"
                alt="Soal Gambar"
              />
            )}

            <div className="form-control flex flex-row justify-start items-center">
              <label className="cursor-pointer label space-x-4">
                <input
                  type="radio"
                  name="pilihan"
                  className="radio"
                  value="D"
                  onChange={(event) => setRadio(event.target.value)}
                  checked={radio === "D"}
                />
                <span className="label-text">
                  {dataOneSoalUjian?.pilihanD?.message}
                </span>
              </label>
            </div>
            {dataOneSoalUjian?.pilihanGambarD?.message !== "" && (
              <img
                src={`${API_IMG_PILIHAN}/${dataOneSoalUjian?.pilihanGambarD?.message}`}
                className="max-w-sm rounded-lg shadow"
                alt="Soal Gambar"
              />
            )}

            <div className="form-control flex flex-row justify-start items-center">
              <label className="cursor-pointer label space-x-4">
                <input
                  type="radio"
                  name="pilihan"
                  className="radio"
                  value="E"
                  onChange={(event) => setRadio(event.target.value)}
                  checked={radio === "E"}
                />
                <span className="label-text">
                  {dataOneSoalUjian?.pilihanE?.message}
                </span>
              </label>
            </div>
            {dataOneSoalUjian?.pilihanGambarE?.message !== "" && (
              <img
                src={`${API_IMG_PILIHAN}/${dataOneSoalUjian?.pilihanGambarE?.message}`}
                className="max-w-sm rounded-lg shadow"
                alt="Soal Gambar"
              />
            )}
          </div>
        </div>
      </div>

      <div className="px-12 py-12 space-y-4">
        <button
          type="button"
          className="btn btn-primary w-full"
          onClick={onSave}
        >
          Simpan
        </button>
        <button
          type="button"
          className="btn btn-accent w-full"
          onClick={onDone}
        >
          Selesai
        </button>
      </div>
    </>
  );
}

export async function getServerSideProps({ req, query }) {
  const tkn = req.cookies.dGtu;
  if (!tkn)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const su = req.cookies.su;
  if (!su)
    return {
      redirect: {
        destination: "/mahasiswa/jadwal-ujian",
        permanent: false,
      },
    };

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
  const { i, q } = query;
  const ct = req.cookies.ct;
  return {
    props: {
      queryIndex: parseInt(i),
      queryParams: q,
      mahasiswa,
      menitUjian: parseInt(ct),
    },
  };
}
