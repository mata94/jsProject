import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [updatedCourse, setUpdatedCourse] = useState({
    title: '',
    description: '',
    slides: [],
    quiz: [],
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesCollection = collection(firestore, 'courses');
        const courseSnapshot = await getDocs(coursesCollection);
        const courseList = courseSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCourses(courseList);
      } catch (error) {
        toast.error('Failed to fetch courses.');
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'courses', id));
      setCourses(courses.filter(course => course.id !== id));
      toast.success('Course deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete course.');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setUpdatedCourse({
      title: course.title,
      description: course.description,
      slides: course.slides,
      quiz: course.quiz,
    });
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(firestore, 'courses', editingCourse.id), updatedCourse);
      setCourses(courses.map(course =>
        course.id === editingCourse.id
          ? { ...course, ...updatedCourse }
          : course
      ));
      setEditingCourse(null);
      toast.success('Course updated successfully!');
    } catch (error) {
      toast.error('Failed to update course.');
    }
  };

  const handleSlideChange = (index, value) => {
    const newSlides = [...updatedCourse.slides];
    newSlides[index] = value;
    setUpdatedCourse(prevState => ({ ...prevState, slides: newSlides }));
  };

  const handleQuizChange = (index, field, value) => {
    const newQuiz = [...updatedCourse.quiz];
    newQuiz[index] = { ...newQuiz[index], [field]: value };
    setUpdatedCourse(prevState => ({ ...prevState, quiz: newQuiz }));
  };

  const handleAddSlide = () => {
    setUpdatedCourse(prevState => ({ ...prevState, slides: [...prevState.slides, ''] }));
  };

  const handleAddQuizQuestion = () => {
    setUpdatedCourse(prevState => ({
      ...prevState,
      quiz: [...prevState.quiz, { question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '' }]
    }));
  };

  return (
    <div className="admin-panel p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="border p-4 rounded-lg shadow-md bg-white">
            {editingCourse && editingCourse.id === course.id ? (
              <>
                <input
                  type="text"
                  className="w-full p-2 mb-2 border rounded"
                  value={updatedCourse.title}
                  onChange={(e) => setUpdatedCourse(prevState => ({ ...prevState, title: e.target.value }))}
                />
                <textarea
                  className="w-full p-2 mb-2 border rounded"
                  value={updatedCourse.description}
                  onChange={(e) => setUpdatedCourse(prevState => ({ ...prevState, description: e.target.value }))}
                />
                <h3 className="text-lg font-semibold mt-4">Slides:</h3>
                {updatedCourse.slides.map((slide, index) => (
                  <input
                    key={index}
                    type="text"
                    className="w-full p-2 mb-2 border rounded"
                    value={slide}
                    onChange={(e) => handleSlideChange(index, e.target.value)}
                  />
                ))}
                <button
                  onClick={handleAddSlide}
                  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  Add Slide
                </button>
                <h3 className="text-lg font-semibold mt-4">Quiz:</h3>
                {updatedCourse.quiz.map((q, index) => (
                  <div key={index} className="mb-4">
                    <input
                      type="text"
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Question"
                      value={q.question}
                      onChange={(e) => handleQuizChange(index, 'question', e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Option A"
                      value={q.optionA}
                      onChange={(e) => handleQuizChange(index, 'optionA', e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Option B"
                      value={q.optionB}
                      onChange={(e) => handleQuizChange(index, 'optionB', e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Option C"
                      value={q.optionC}
                      onChange={(e) => handleQuizChange(index, 'optionC', e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Option D"
                      value={q.optionD}
                      onChange={(e) => handleQuizChange(index, 'optionD', e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full p-2 mb-2 border rounded"
                      placeholder="Correct Answer"
                      value={q.correctAnswer}
                      onChange={(e) => handleQuizChange(index, 'correctAnswer', e.target.value)}
                    />
                  </div>
                ))}
                <button
                  onClick={handleAddQuizQuestion}
                  className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  Add Quiz Question
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 ml-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <p className="mt-2 text-sm">{course.description}</p>
                <button
                  onClick={() => handleEdit(course)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course.id)}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminPanel;
