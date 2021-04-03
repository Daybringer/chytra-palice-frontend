import axios from "axios";

const baseDomain =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://palice.gjk.cz:3000";

const baseURL = `${baseDomain}`;
export default axios.create({
  baseURL,
  headers: {
    Authorization: "",
    "content-type": "application/json",
  },
});
