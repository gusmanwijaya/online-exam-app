import Head from "next/head";

export default function Header({ title }) {
  return (
    <Head>
      <title>{title} - Website Ujian Online</title>
      <meta name="description" content="Website Ujian Online" />
      <meta property="og:title" content="Website Ujian Online" />
      <meta property="og:description" content="Website Ujian Online" />
    </Head>
  );
}
