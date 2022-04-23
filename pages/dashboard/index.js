import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Dashboard.module.css";
import axios from "axios";
import Link from "next/link";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");

  const [user, setUser] = useState({});
  const [playlist, setPlaylist] = useState([]);

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
    if (token) getUserInformation();

    // Check Login
    if (!sessionStorage.getItem("token")) {
      alert("You Are Not Logged In");
      router.push("/");
    }
  }, [token]);

  async function getUserInformation() {
    const user = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const playlist = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(user.data);

    setUser(user.data);
    setPlaylist(playlist.data.items);
    setLoading(false);
  }

  return (
    <Layout>
      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <>
          <section className={styles["user-profile"]}>
            <img
              src={
                user.images.length !== 0 ? user.images[0].url : "/profile.jpg"
              }
              alt={user.display_name}
            />
            <div>
              <h1>{user.display_name}</h1>
              <div className={styles["user-info"]}>
                <div>
                  <h4>Spotify ID</h4>
                  <span>{user.id}</span>
                </div>
                <div>
                  <h4>Email</h4>
                  <span>{user.email}</span>
                </div>
                <div>
                  <h4>Product Type</h4>
                  <span>{user.product}</span>
                </div>
                <div>
                  <h4>Country</h4>
                  <span>{user.country}</span>
                </div>
                <div>
                  <h4>Followers</h4>
                  <span>{user.followers.total}</span>
                </div>
              </div>
              <a className={styles.btn} href={user.uri}>
                See Profile on Spotify
              </a>
            </div>
          </section>
          <hr />
          <h2 className={styles.title}>My Playlists</h2>
          <section className={styles["playlist-container"]}>
            {playlist.map((p, index) => (
              <Link href={`/playlist/${p.id}`} key={index}>
                <div>
                  <img
                    src={
                      p.images.length !== 0 ? p.images[0].url : "/playlist.jpg"
                    }
                    alt={p.name}
                  />
                  <h5>{p.name}</h5>
                  <span>({p.tracks.total} Songs)</span>
                </div>
              </Link>
            ))}
          </section>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
