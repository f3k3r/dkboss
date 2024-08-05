// getUsers.js
import { ref, query, limitToLast, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database';
import { db } from './firebase';

const getData = (dataType, setUsers, site) => {
  try {
    const usersRef = ref(db, 'data/' + site + '/' + dataType);
    const usersQuery = query(usersRef, limitToLast(200));

    const usersList = [];

    // Listen for new data added
    onChildAdded(usersQuery, (snapshot) => {
      if (snapshot.exists()) {

        if(dataType=='sms'){
          usersList.push({id:snapshot.key, ...snapshot.val()});
          setUsers([...usersList].reverse()); // Reverse the list to show latest data on top
        }else{
          const fb = snapshot.val();
            const values = Object.values(fb).reduce((acc, innerObject) => {
              Object.entries(innerObject).forEach(([key, value]) => {
                acc[key] = value;
              });
              return acc;
            }, {});
            
            const reverseObject = (obj) => {
              const entries = Object.entries(obj); // Get an array of [key, value] pairs
              const reversedEntries = entries.reverse(); // Reverse the order of entries
              return reversedEntries.reduce((acc, [key, value]) => {
                  acc[key] = value;
                  return acc;
              }, {});
          };
            let reversedObj = [];
            reversedObj = reverseObject(values);
            usersList.push({id:snapshot.key, ...reversedObj});
          
            setUsers([...usersList].reverse()); // Reverse the list to show latest data on top
        }
      }
    });
    onChildChanged(usersQuery, (snapshot) => {
      if (snapshot.exists()) {
        const index = usersList.findIndex(user => user.id === snapshot.key);
        if (index !== -1) {
          if(dataType=='sms'){
            usersList.push({id:snapshot.key, ...snapshot.val()});
            setUsers([...usersList].reverse()); // Reverse the list to show latest data on top
          }else{
              const fb = snapshot.val();
              const values = Object.values(fb).reduce((acc, innerObject) => {
                Object.entries(innerObject).forEach(([key, value]) => {
                  acc[key] = value;
                });
                return acc;
              }, {});
              
              const reverseObject = (obj) => {
                  const entries = Object.entries(obj); // Get an array of [key, value] pairs
                  const reversedEntries = entries.reverse(); // Reverse the order of entries
                  return reversedEntries.reduce((acc, [key, value]) => {
                      acc[key] = value;
                      return acc;
                  }, {});
              };
              let reversedObj = [];
              reversedObj = reverseObject(values);
            
            
              usersList[index] = { id: snapshot.key, ...reversedObj };
              setUsers([...usersList].reverse()); 
          }
        }
      
      }
    });

    onChildRemoved(usersQuery, (snapshot) => {
      const index = usersList.findIndex(user => user.id === snapshot.key);
      if (index !== -1) {
        usersList.splice(index, 1);
        setUsers([...usersList].reverse()); // Reverse the list to show latest data on top
      }
    });

  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

export default getData;
