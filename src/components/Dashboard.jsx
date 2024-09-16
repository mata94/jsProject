import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../utils/firebase';
import { onAuthStateChanged } from "firebase/auth";

const Dashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserId = () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          console.error('User is not logged in');
        }
      });
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        const userData = userDoc.exists() ? userDoc.data() : null;
        setUserInfo(userData);

        if (userData && userData.completedCourses) {
          const coursesWithTitles = await Promise.all(
            userData.completedCourses.map(async (course) => {
              const courseDoc = await getDoc(doc(firestore, 'courses', course.courseId));
              return {
                ...course,
                title: courseDoc.exists() ? courseDoc.data().title : 'Unknown Course',
              };
            })
          );
          setEnrolledCourses(coursesWithTitles);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="mt-4">Manage your enrolled courses and track your progress here.</p>

      {userInfo && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold">User Information</h2>
          <p className="mt-2"><strong>Name:</strong> {userInfo.username || 'N/A'}</p>
          <p className="mt-2"><strong>Email:</strong> {userInfo.email}</p>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Your Courses</h2>
        {enrolledCourses.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Course</th>
                <th className="py-2 px-4 border-b">Score</th>
                <th className="py-2 px-4 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((course, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{course.title}</td>
                  <td className="py-2 px-4 border-b">{course.score}/5</td>
                  <td className="py-2 px-4 border-b">
                    <a
                      href={`/course/${course.courseId}`}
                      className="text-blue-600 hover:underline"
                    >
                      Go to Course
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4">You have not completed any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
