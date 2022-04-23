import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import querystring from "querystring";

const Login = () => {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    if (code) getToken();
  }, [code]);

  async function getToken() {
    const redirectUri =
      window.location.hostname === "localhost"
        ? "http://localhost:3000/login"
        : "";

    const clientId = "db5f0d7750c44115acd3cd74d791da23";
    const clientSecret = "19dfe90ce1a244ffa2d6b726f8dc1a66";

    const data = {
      grant_type: "authorization_code",
      code: code,
      client_secret: clientSecret,
      client_id: clientId,
      redirect_uri: redirectUri,
    };

    const token = await axios
      .post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify(data),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .catch((err) => console.log(err));

    if (token) storeToken(token.data.access_token);
    else {
      alert("invalid code, please login again");
      router.push("/");
    }
  }

  function storeToken(token) {
    sessionStorage.setItem("token", token);
    router.push("/dashboard");
  }

  return <div>Processing...</div>;
};

export default Login;
