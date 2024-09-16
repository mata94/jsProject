import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AddCourse from './pages/AddCourse';
import NavBar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';
import About from './pages/About';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './components/Dashboard';
import Contact from './pages/ContactPage';
import Course from './components/Course';
import CourseDetail from './components/CourseDetail';

const App = () => {
 
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/course/:courseId" element={<CourseDetail  />} />
          <Route path="/courses" element={<PrivateRoute><Course /></PrivateRoute>} />
          <Route path="/add-course" element={<PrivateRoute><AddCourse /></PrivateRoute>} />
          <Route path="/admin-panel" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );

};
export default App;
