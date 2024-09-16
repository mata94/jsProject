import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(firestore, 'users'));
      setUsers(usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchUsers();
  }, [firestore]);

  const handleDeleteUser = async (id) => {
    await deleteDoc(doc(firestore, 'users', id));
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-xl font-semibold mb-2">{user.username}</h3>
          <p>Email: {user.email}</p>
          <p>Recipes user uploaded: {user.recipeCount}.</p>
          <button 
            onClick={() => handleDeleteUser(user.id)} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserList;
