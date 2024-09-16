import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
import { Link } from 'react-router-dom';

const Course = () => {
  const [courses, setCourses] = useState([]);

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
        {courses.map(course => (
          <div key={course.id} className="border p-4 rounded-lg shadow-md">
            <Link key={course.id} to={`/courses/${course.id}`}>
            <h2 className="text-xl font-semibold">{course.title}</h2>
            <p className="mt-2 text-sm">{course.description}</p>
            <p className="mt-2 text-sm text-gray-500">Category: {course.category}</p>
        </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Course;
