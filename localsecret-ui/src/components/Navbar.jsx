import { Link } from "@nextui-org/react";
import "../App.css";
import { EXPLORER_URL } from "../constants/constants";

function Navbar() {
  return (
    <div className="Navbar">
      <Link href="/">Home</Link>
      <Link href="/faucet">Faucet</Link>
      <Link href="/keplr">Keplr Connect</Link>
      <Link href="/secretcli">Secret CLI config</Link>
      <Link
        icon
        color="primary"
        target="_blank"
        href={EXPLORER_URL}
      >
        Explorer
      </Link>
    </div>
  );
}
export default Navbar;