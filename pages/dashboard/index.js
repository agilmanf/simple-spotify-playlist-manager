import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Dashboard.module.css";
import axios from "axios";

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
    console.log(playlist.data.items);
    setUser(user.data);
    setPlaylist(playlist.data.items);
    setLoading(false);
  }

  function playlistClick(id) {
    alert(id);
  }

  return (
    <Layout>
      <hr />
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
                <h4>Username : {user.display_name}</h4>
                <h4>Email : {user.email}</h4>
                <h4>Member : {user.product}</h4>
                <h4>Country : {user.country}</h4>
                <a href={user.uri}>See Profile on Spotify</a>
              </div>
            </div>
          </section>
          <hr />
          <h2>My Playlists</h2>
          <section className={styles["playlist-container"]}>
            {playlist.map((p, index) => (
              <div key={index} onClick={() => playlistClick(p.id)}>
                <img
                  src={
                    p.images.length !== 0 ? p.images[0].url : "/playlist.jpg"
                  }
                  alt={p.name}
                />
                <h5>{p.name}</h5>
                <span>({p.tracks.total} Songs)</span>
              </div>
            ))}
          </section>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
