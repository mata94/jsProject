import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../utils/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [userId, setUserId] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const fetchUserId = () => {
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
      } else {
        console.error('User is not logged in');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) {
          console.error('Course ID is undefined');
          return;
        }
        const courseDoc = await getDoc(doc(firestore, 'courses', courseId));
        if (courseDoc.exists()) {
          setCourse(courseDoc.data());
        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const nextSlide = () => {
    if (currentSlide < course.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setCurrentSlide(null); // End of slides, start quiz
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const submitAnswer = () => {
    if (selectedAnswer === course.quiz[currentQuestion].correctAnswer) {
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      setIsCorrect(false);
    }

    if (currentQuestion < course.quiz.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1500); // Delay to show if the answer was correct or not
    } else {
      setQuizFinished(true);
      updateScore();
    }
  };

  const updateScore = async () => {
    if (!userId || !courseId) {
      console.error('User ID or Course ID is undefined');
      return;
    }

    try {
      const userDocRef = doc(firestore, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      let userData = userDocSnap.exists() ? userDocSnap.data() : { completedCourses: [], finishedCourses: 0 };

      const completedCourses = userData.completedCourses || [];
      const existingCourse = completedCourses.find((course) => course.courseId === courseId);

      if (existingCourse) {
        existingCourse.score = score;
      } else {
        completedCourses.push({ courseId, score });
      }

      await updateDoc(userDocRef, {
        completedCourses,
        finishedCourses: (userData.finishedCourses || 0) + 1,
      });

      toast.success('Course completed and score updated!');
    } catch (error) {
      console.error('Error updating score:', error);
      toast.error('Failed to update the score.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (!course) {
    return <div className="text-center py-4">Course not found</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
      <p className="mt-4 text-gray-600">{course.description}</p>

      {currentSlide !== null && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Slide {currentSlide + 1}</h2>
          <p className="mt-2">{course.slides[currentSlide]}</p>
          <button
            onClick={nextSlide}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Next Slide
          </button>
        </div>
      )}

      {currentSlide === null && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Quiz</h2>
          <p className="mt-2">{course.quiz[currentQuestion].question}</p>
          <div className="mt-4 space-y-2">
            {course.quiz[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`block w-full px-4 py-2 border rounded-md transition duration-300 ${
                  selectedAnswer === option ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={submitAnswer}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
          {isCorrect !== null && (
            <p className={`mt-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
          )}
        </div>
      )}

      {quizFinished && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Your Score: {score}/{course.quiz.length}</h3>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default CourseDetail;
