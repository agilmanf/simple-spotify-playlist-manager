import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  function handleClick() {
    const redirectUri =
      window.location.hostname === "localhost"
        ? "http://localhost:3000/login"
        : "";

    const clientId = "db5f0d7750c44115acd3cd74d791da23";
    const scope =
      "user-read-email%20user-read-private%20playlist-read-collaborative%20playlist-modify-public%20playlist-read-private%20playlist-modify-private";
    const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location = authURL;
  }

  return (
    <>
      <Head>
        <title>Playlist Manager | Login</title>
      </Head>
      <div className={styles.container}>
        <h1>Simple Spotify Playlist Manager</h1>
        <button className={styles["btn-login"]} onClick={handleClick}>
          Login With Spotify
        </button>
      </div>
    </>
  );
}
