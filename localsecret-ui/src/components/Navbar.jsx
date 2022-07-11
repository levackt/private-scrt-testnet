import { Link } from "@nextui-org/react";
import "../App.css";

function Navbar() {
  return (
    <div className="Navbar">
      <Link href="/">Home</Link>
      <Link href="/faucet">Faucet</Link>
      <Link href="/keplr">Keplr Connect</Link>
      {/* todo get the URL from env or config */}
      <Link
        icon
        color="primary"
        target="_blank"
        href="https://explorer.scrttestnet.com/"
      >
        Explorer
      </Link>
    </div>
  );
}
export default Navbar;