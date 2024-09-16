import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore, auth } from '../utils/firebase';
import { Link } from 'react-router-dom';

const Home = () => {
  const [courses, setCourses] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(firestore, 'courses');
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList);
    };

    fetchCourses();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-sm mb-2">{course.description}</p>
            <p className="text-sm text-gray-500">Category: {course.category}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        {user ? (
          <>
            <p className="text-lg mb-4">Go here and start courses!</p>
            <Link to="/courses" className="inline-block px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300">
              Go to Courses
            </Link>
          </>
        ) : (
          <>
            <p className="text-lg mb-4">Log in to access and start doing courses!</p>
            <Link to="/login" className="inline-block px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300">
              Log In
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
