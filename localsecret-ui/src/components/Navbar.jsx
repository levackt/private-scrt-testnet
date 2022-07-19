import { Link } from "@nextui-org/react";
import "../App.css";
import { EXPLORER_URL } from "../constants/constants";

function Navbar() {
  return (
    <div>
      <ul className="menu w-56 bg-secondary text-secondary-content p-2 rounded-box">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/keplr">Keplr Connect</Link></li>
        <li><Link href="/faucet">Faucet</Link></li>
        <li><Link href="/secretcli">Secret CLI config</Link></li>
        <li>
          <Link
            icon
            color="primary"
            target="_blank"
            href={EXPLORER_URL}
          >
            Explorer
          </Link>
        </li>
    </ul>
      {/* <Link href="/">Home</Link>
      <Link href="/keplr">Keplr Connect</Link>
      <Link href="/faucet">Faucet</Link>
      <Link href="/secretcli">Secret CLI config</Link>
      <Link
        icon
        color="primary"
        target="_blank"
        href={EXPLORER_URL}
      >
        Explorer
      </Link> */}
    </div>
  );
}
export default Navbar;