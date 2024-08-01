// getUsers.js
import { ref, get } from 'firebase/database';
import { db } from './firebase';

const getUsers = async () => {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const usersList = [];
      snapshot.forEach(userSnapshot => {
        usersList.push({ id: userSnapshot.key, ...userSnapshot.val() });
      });
      return usersList;
    } else {
      console.log('No data available');
      return [];
    }
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
};

export default getUsers;
