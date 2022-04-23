import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const router = useRouter();

  function logout() {
    sessionStorage.clear();
    router.push("/");
  }
  return (
    <nav>
      <h3 className="title">Simple Spotify Playlist Manager</h3>
      <ul className="menu">
        <Link href="/dashboard">
          <li>Home</li>
        </Link>
        <li onClick={logout}>Logout</li>
      </ul>
    </nav>
  );
};

export default Navbar;
