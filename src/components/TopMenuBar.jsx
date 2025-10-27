import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaShareAlt,
  FaBell,
  FaCog,
  FaCoins,
  FaUserCircle,
  FaSignal,
  FaTimes,
  FaBars,
  FaWallet,
  FaMoneyBill,
  FaSignOutAlt,
  FaRegCopyright,
  FaRupeeSign,
  FaInfoCircle,
  FaUserShield,
  FaFileContract,
  FaAddressBook,
  FaRecycle,
  FaShoppingCart
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import sideBarLanguage from "../language/sidebar.json"
import logo from "../assets/logo.png"
import { getAuthToken } from "../utils/getAuthToken";
import { decodeToken } from "../utils/decodeToken";
import API from "../utils/axios";
import UserCoins from "./userCoins";
import { FaTrophy } from "react-icons/fa6";


function TopMenuBar({ coinRefreshKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navigator = useNavigate();
  const [userData, setUserData] = useState();
  const [wallet, setWallet] = useState('00')



  // fetch api
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const userData = decodeToken(token);
    const userId = userData?.id;
    if (!userId) return;
   const fetchUserData = async () => {
  try {
    const res = await API.get(`/users/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = res.data;
    setWallet(user.wallet);
  } catch (error) {
    console.error('Failed to fetch user data:', error);
  }
};


    fetchUserData();
  }, []);




  // Language
  const defaultLang = localStorage.getItem('lang') || 'en';
  const [lang, setLang] = useState(defaultLang);
  const trans = sideBarLanguage[lang] || sideBarLanguage['en'];


  // user data 
  useEffect(() => {
    const authToken = getAuthToken();
    if (!authToken) {
      console.warn('No auth token found');
      return;
    }
    const usersData = decodeToken(authToken);

    // console.log("user data", usersData);

    setWallet(usersData.wallet)

    if (usersData) {
      setUserData(usersData);
    } else {
      console.error('Token could not be decoded');
    }
  }, []);

  const handleClick=()=>{
navigator('/')
  }

  return (
    <>
      <header className="topbar">
        <div className="left">
          <span className="toggle-btn pt-2" onClick={toggleSidebar}>
            <FaBars />
          </span>
          <div className="logo cursor-pointer" onClick={handleClick}>
             <img src={logo} alt="logo" />
          </div>

        </div>
        <div className="right">
          <div className="icon-btn" onClick={() => navigator('/wallet')}>
            <FaCoins /> <span className="coin-count">{<UserCoins refreshKey={coinRefreshKey}/>}</span>
          </div>
          <div className="icon-btn"><FaBell /></div>
          {/* <div className="icon-btn"><FaUserCircle /></div> */}
        </div>
      </header>

      {/* Sidebar */}
      <div className={`custom-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="close-btn" onClick={toggleSidebar}><FaTimes /></button>
          <div className="d-flex justify-content-center align-items-center gap-2">
            {/* <img src="https://placehold.co/80x80" alt="Profile" className="profile-img" /> */}
            <div>
              <h5 className="text-xlg p-0 m-0">
                {(userData?.firstName || '') + ' ' + (userData?.middleName || '') + ' ' + (userData?.lastName || '') || 'Guest'}
              </h5>
              <p className="userId">{userData?.email || ''}</p>
            </div>
          </div>
          <hr />
          <div className="row mt-3">
            <div className="col-6 border-right-gradient">
              <div className="d-flex gap-1">
                <span className="icon-bar"><FaMoneyBill /></span>
                <div className="d-flex flex-column ">
                  <p className="label text-sm">{trans.showWallet}</p>
                  <p className="value">{wallet}</p>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex gap-1 justify-content-end">
                <span className="icon-bar"><FaCoins /></span>
                <div className="d-flex flex-column">
                  <p className="label text-sm">{trans.cointEarn}</p>
                  <p className="value">{<UserCoins refreshKey={coinRefreshKey}/>}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Link to="/subscription" onClick={() => setIsOpen(false)} className="premium-btn d-flex justify-content-between align-items-center">
            <div>Upgrade to Primium</div>
            <div>→</div>
          </Link>
        </div>

        <ul className="sidebar-menu">
          <li className={isActive("/profile") ? "active" : ""}>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaUser /> {trans.profile}</div>
              <div className="right">→</div>
            </Link>
          </li>
          <li className={isActive("/balance") ? "active" : ""}>
            <Link to="/wallet" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaRupeeSign /> {trans.balance}</div>
              <div className="right money">→</div>
            </Link>
          </li>
          <li className={isActive("/contests-list") ? "active" : ""}>
            <Link to="/contests-list" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaTrophy /> Winners</div>
              <div className="right money">→</div>
            </Link>
          </li>
          <li className={isActive("/my-order") ? "active" : ""}>
            <Link to="/my-order" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaShoppingCart /> {trans.myOrder}</div>
              <div className="right money">→</div>
            </Link>
          </li>
          <li className={isActive("/refer") ? "active" : ""}>
            <Link to="/refer" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaShareAlt />{trans.refer}</div>
              <div className="right money">→</div>
            </Link>
          </li>
          <li className={isActive("/settings") ? "active" : ""}>
            <Link to="/settings" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaCog /> {trans.setting}</div>
              <div className="right">→</div>
            </Link>
          </li>
          <li className={isActive("/about") ? "active" : ""}>
            <Link to="/about" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaInfoCircle /> {trans.about}</div>
              <div className="right">→</div>
            </Link>
          </li>
          <li className={isActive("/privacy-policy") ? "active" : ""}>
            <Link to="/privacy-policy" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaUserShield />{trans.privacyPolicy}</div>
              <div className="right">→</div>
            </Link>
          </li>
          <li className={isActive("/refund-policy") ? "active" : ""}>
            <Link to="/refund-policy" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaRecycle />{trans.refundPolicy}</div>
              <div className="right">→</div>
            </Link>
          </li>
          <li className={isActive("/terms-conditions") ? "active" : ""}>
            <Link to="/terms-conditions" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaFileContract />{trans.termsConditions}</div>
              <div className="right">→</div>
            </Link>
          </li>
          <li className={isActive("/contact") ? "active" : ""}>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaAddressBook />{trans.contact}</div>
              <div className="right">→</div>
            </Link>
          </li>
          <li className={`border-0 logout ${isActive("/logout") ? "active" : ""}`}>
            <Link to="/logout" onClick={() => setIsOpen(false)} className="d-flex justify-content-between align-items-center">
              <div className="left"><FaSignOutAlt />{trans.logOut}</div>
              <div className="right">→</div>
            </Link>
          </li>
        </ul>

        <div className="sidebar-footer">
          <small><FaRegCopyright /> {new Date().getFullYear()} EarnQ. All rights reserved.</small>
          <small> Version v1.0.1</small>
        </div>

      </div>
    </>
  );
}

export default TopMenuBar;
