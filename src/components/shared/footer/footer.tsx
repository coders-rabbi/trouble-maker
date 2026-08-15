import Link from "next/link";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-black py-28 flex flex-col gap-16 mt-20">
      <div className="text-[#F5F0F0] flex justify-center items-center gap-5 text-4xl">
        <Link href="https://www.facebook.com/share/1BgqtURSYV/?mibextid=wwXIfr">
          <FaFacebook />
        </Link>
        <Link href="https://www.instagram.com/troublemaker_bangladesh?igsh=MTI3ajgyYjRibm5iMg==">
          <FaInstagram />
        </Link>
        <Link href="https://www.facebook.com/share/g/18CVd1xj3y/?mibextid=wwXIfr">
          <FaYoutube />
        </Link>
        <Link href="https://www.tiktok.com/@troublemaker.bangladesh?_r=1&_t=ZS-98tnUGD3oVJ">
          <FaTiktok />
        </Link>
      </div>

      {/* footer manu items */}
      <div>
        <ul className="text-gray-500 text-center flex items-center gap-5 justify-center flex-wrap">
          <li>
            <Link href="">Support</Link>
          </li>
          <li>
            <Link href="">Privacy</Link>
          </li>
          <li>
            <Link href="">Terms</Link>
          </li>
          <li>
            <Link href="">Return & Exchange</Link>
          </li>
          <li>
            <Link href="">Contact</Link>
          </li>
        </ul>
      </div>

      {/* copyright section */}
      <div>
        <p className="text-gray-600 text-center">
          &copy; {new Date().getFullYear()} Trouble Maker Bangladesh
        </p>
      </div>
    </div>
  );
};

export default Footer;
