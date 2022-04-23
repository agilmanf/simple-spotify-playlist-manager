import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import style from "../../styles/Playlist.module.css";

const PlaylistDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const [playlist, setPlaylist] = useState({});
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [trackUriDelete, setTrackUriDelete] = useState("");

  useEffect(() => {
    if (token && id) getPlaylistInformation();
    setToken(sessionStorage.getItem("token"));
  }, [token, id]);

  async function getPlaylistInformation() {
    const res = await axios.get("https://api.spotify.com/v1/playlists/" + id, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setPlaylist(res.data);
    setTracks(res.data.tracks.items);
    setLoading(false);
  }

  function handleDelete(trackUri) {
    setShowModal(true);
    setTrackUriDelete(trackUri);
  }

  async function deletePlaylistItem() {
    setShowModal(false);
    const trackDelete = { tracks: [{ uri: trackUriDelete }] };
    await axios
      .delete(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: trackDelete,
      })
      .then((res) => getPlaylistInformation())
      .catch((err) => {
        alert("You cannot remove tracks from a playlist you don't own.");
      });
  }

  return (
    <Layout>
      {loading ? (
        <h3>Loading</h3>
      ) : (
        <>
          {showModal ? (
            <div className={style.modal}>
              <div>
                <h2>Are you sure want to remove this item?</h2>
                <section>
                  <button onClick={() => deletePlaylistItem()}>Yes</button>
                  <button onClick={() => setShowModal(false)}>No</button>
                </section>
              </div>
            </div>
          ) : (
            ""
          )}
          <section className={style.desc}>
            <img
              src={
                playlist.images.length !== 0
                  ? playlist.images[0].url
                  : "/playlist.jpg"
              }
            />
            <div>
              <h1>{playlist.name}</h1>
              <h3>Created By {playlist.owner.display_name}</h3>
              <p>{playlist.description}</p>
              <a className={style.btn} href={playlist.uri}>
                Open Playlist in Spotify
              </a>
            </div>
          </section>
          <section className={style.songs}>
            <h2>Tracks List</h2>
            <table>
              <thead>
                <tr>
                  <th className={style.columnNumber}>#</th>
                  <th className={style.columnTitle}>Title</th>
                  <th className={style.columnAction}></th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((t, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <div>
                        <img src={t.track.album.images[2].url} />
                        <span>
                          {t.track.name} - {t.track.artists[0].name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(t.track.uri)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </Layout>
  );
};

export default PlaylistDetails;
