import { Link, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebase';

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUser(currentUser);
            const userData = userDocSnap.data();
            setIsAdmin(userData.role === 'admin');
          } else {
            console.error('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.setItem('isLoggedIn', 'false');
      navigate('/login');
    });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">E-learning</span>
        </Link>
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            aria-controls="navbar-menu"
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
        <div className={`w-full md:flex md:items-center md:w-auto ${menuOpen ? 'block' : 'hidden'}`} id="navbar-menu">
          <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded ${location.pathname === '/' ? 'text-blue-700 dark:text-blue-500' : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block py-2 px-3 rounded ${location.pathname === '/about' ? 'text-blue-700 dark:text-blue-500' : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className={`block py-2 px-3 rounded ${location.pathname === '/courses' ? 'text-blue-700 dark:text-blue-500' : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'}`}
              >
                Courses
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link
                  to="/add-course"
                  className={`block py-2 px-3 rounded ${location.pathname === '/add-course' ? 'text-blue-700 dark:text-blue-500' : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'}`}
                >
                  Add new course
                </Link>
              </li>
            )}
            {isAdmin && (
              <li>
                <Link
                  to="/admin-panel"
                  className={`block py-2 px-3 rounded ${location.pathname === '/admin-panel' ? 'text-blue-700 dark:text-blue-500' : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'}`}
                >
                  Admin
                </Link>
              </li>
            )}
            {user ? ( <>
                <li>
                <Link
                  to="/dashboard"
                  className={`block py-2 px-3 rounded ${location.pathname === '/dashboard' ? 'text-blue-700 dark:text-blue-500' : 'text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500'}`}
                >
                  Dashboard
                </Link>
              </li>
             
              <li>
                
                <button
                  onClick={handleLogout}
                  className="block py-2 px-3 rounded text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500"
                  >
                  Sign out
                </button>

              </li>
                  </>
              
            ) : (
              <>
                <li>
                  <Link
                    to="/signup"
                    className="block py-2 px-3 rounded text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500"
                  >
                    Get started
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="block py-2 px-3 rounded text-gray-900 dark:text-white hover:text-blue-700 dark:hover:text-blue-500"
                  >
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
