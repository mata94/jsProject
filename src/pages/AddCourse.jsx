import CourseForm from '../components/CourseForm';

const AddRecipe = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl">Add New Course</h1>
      <CourseForm />
    </div>
  );
};

export default AddRecipe;