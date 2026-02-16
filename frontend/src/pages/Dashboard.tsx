import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FaCamera, FaChartLine, FaHistory, FaBars, FaSignOutAlt, FaCoins, FaUserMd, FaHeartbeat, FaMagic, FaUserCog } from 'react-icons/fa';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useCredits } from '../context/CreditContext';
import { logo, hair } from '../assets/index';
import styles from '../styles/DashboardStyles';
import WeatherWidget from '../components/WeatherWidget';

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const { user } = useUser();
  const { signOut } = useClerk();
  const { credits } = useCredits();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleCard = () => setShowCard((prev) => !prev);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowCard(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 3 ? `${username.slice(0, 3)}** ` : username;
    const maskedDomain = domain.split('.').map((part, index) => (index === 0 ? `${part[0]}** ` : part)).join('.');
    return `${maskedUsername} @${maskedDomain} `;
  };

  return (
    <div className={styles.container}>
      {/* Mobile Toggle Button */}
      {!isHomePage && (
        <div className={styles.mobileToggle}>
          <span className={styles.mobileTitle}>Hair Analysis</span>
          <button onClick={toggleSidebar} className={styles.toggleButton}>
            <FaBars className={styles.toggleIcon} />
          </button>
        </div>
      )}

      {/* Sidebar */}
      {!isHomePage && (
        <aside className={`${styles.sidebar} ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <div className={styles.logoContainer}>
            <img src={logo} alt="Logo" className={styles.logoImage} />
            <span className={styles.logoText}>Hair Analysis</span>
          </div>

          {/* Navigation Links */}
          <nav className={styles.nav}>
            <Link
              to="/dashboard/analysis"
              className={`${styles.navLink} ${location.pathname === '/dashboard/analysis' ? styles.activeLink : ''} `}
            >
              <FaChartLine className={`${styles.navIcon} ${location.pathname === '/dashboard/analysis' ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} `} />
              <span className={styles.navText}>Beauty</span>
            </Link>
            <Link
              to="/dashboard/photo"
              className={`${styles.navLink} ${location.pathname === '/dashboard/photo' ? styles.activeLink : ''} `}
            >
              <FaCamera className={`${styles.navIcon} ${location.pathname === '/dashboard/photo' ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} `} />
              <span className={styles.navText}>Take Photo</span>
            </Link>
            <Link
              to="/dashboard/pricing"
              className={`${styles.navLink} ${location.pathname === '/dashboard/pricing' ? styles.activeLink : ''} `}
            >
              <FaCoins className={`${styles.navIcon} ${location.pathname === '/dashboard/pricing' ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} `} />
              <span className={styles.navText}>Buy Credits</span>
            </Link>
            <Link
              to="/dashboard/history"
              className={`${styles.navLink} ${location.pathname === '/dashboard/history' ? styles.activeLink : ''} `}
            >
              <FaHistory className={`${styles.navIcon} ${location.pathname === '/dashboard/history' ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} `} />
              <span className={styles.navText}>History</span>
            </Link>
            <Link
              to="/dashboard/consult"
              className={`${styles.navLink} ${location.pathname === '/dashboard/consult' ? styles.activeLink : ''} `}
            >
              <FaUserMd className={`${styles.navIcon} ${location.pathname === '/dashboard/consult' ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} `} />
              <span className={styles.navText}>Expert AI</span>
            </Link>
            <Link
              to="/dashboard/hair-loss"
              className={`${styles.navLink} ${location.pathname === '/dashboard/hair-loss' ? styles.activeLink : ''} `}
            >
              <FaHeartbeat className={`${styles.navIcon} ${location.pathname === '/dashboard/hair-loss' ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} `} />
              <span className={styles.navText}>Risk Calc</span>
            </Link>
            <Link
              to="/dashboard/style-guide"
              className={`${styles.navLink} ${location.pathname === '/dashboard/style-guide' ? styles.activeLink : ''} `}
            >
              <FaMagic className={`${styles.navIcon} ${location.pathname === '/dashboard/style-guide' ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} `} />
              <span className={styles.navText}>Style Guide</span>
            </Link>
            <Link
              to="/dashboard/profile"
              className={`${styles.navLink} ${location.pathname === '/dashboard/profile' ? styles.activeLink : ''} `}
            >
              <FaUserCog className={`${styles.navIcon} ${location.pathname === '/dashboard/profile' ? 'text-white' : 'text-gray-500 group-hover:text-purple-600'} `} />
              <span className={styles.navText}>Profile</span>
            </Link>
          </nav>

          {/* Sidebar Footer with User Information */}
          <div className={styles.sidebarFooter}>
            <p className={styles.credits}>Credits: {credits}</p>
            <div onClick={toggleCard} className={styles.avatarContainer}>
              <img
                src={user?.imageUrl || hair}
                alt="User Avatar"
                className={styles.avatarImage}
              />
            </div>
            <div className={styles.userInfo}>
              {user ? (
                <p className={styles.userName}>{user.fullName || "User Name"}</p>
              ) : (
                <p className={styles.userName}>Guest User</p>
              )}
              <p className={styles.userEmail}>{maskEmail(user?.primaryEmailAddress?.emailAddress || "user@example.com")}</p>
            </div>
          </div>

          {/* User Info Card */}
          {showCard && user && (
            <div
              ref={cardRef}
              className={styles.userCard}
            >
              <div className={styles.cardHeader}>
                <img
                  src={user?.imageUrl || hair}
                  alt="User Avatar"
                  className={styles.cardAvatar}
                />
                <div>
                  <p className={styles.cardUserName}>{user?.fullName || "User Name"}</p>
                  <p className={styles.cardUserEmail}>{user?.primaryEmailAddress?.emailAddress || "user@example.com"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </aside>
      )}

      {/* Main Content */}
      <div className={styles.mainContent}>
        <WeatherWidget />
        <Outlet /> {/* This is where different pages will be rendered */}
      </div>
    </div>
  );
};

export default Dashboard;
