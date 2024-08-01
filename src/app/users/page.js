'use client';
import Link from "next/link";
import Footer from "../include/footer";
import Header from "../include/header";
import { useEffect, useState } from "react";  
import getUsers from '../include/getUsers';
import { ref , remove} from "firebase/database";
import { db } from "../include/firebase";
import { isLogin } from "../include/auth";
import { useRouter } from "next/navigation";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const router = useRouter();
  
    const fetchUsers = async () => {
        const usersList = await getUsers();
        setUsers(usersList);
        setLoading(false);
      };

    useEffect(()  => {
      if(!isLogin()){
          router.push("/login");
      }
        fetchUsers();
      }, []);

      const deleteUser = (id) => {
        setLoading(true); 
        const profilesRef = ref(db, 'users/'+id); 
        remove(profilesRef)
          .then(() => {
            setMessage("User Delete Successfully");
            fetchUsers();
          })
          .catch((error) => {
            console.error('Error saving data:', error);
            setMessage("Error saving data");
          })
          .finally(() => {
            setLoading(false);  
          });;
      };

  return (
    <>
    <Header />
    <main className="container">
       <div className="card">
            <div className="card-body ">
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h2>Users List({users.length})</h2>
                </div>
                <hr className="m-0" />
                {
                    message ? (<div className="alert alert-success py-2 mt-4">{message}</div>) : ''
                }
                <div className="card-container mt-4">
                    <div className="row">
                    {users.map(user => (
                            <div className="col-12" key={user.site}>
                                <div className="card my-3 position-relative " >
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Site : {user.site}</li>
                                        <li className="list-group-item">Forward Phone : {user.phone}</li>
                                        <li className="list-group-item">A/c Status : <span className="badge bg-primary">Enabled</span> </li>
                                    </ul>
                                    
                                    <div className="card-body" style={{    position: "absolute",right: "-28px",top: "-29px"}}>
                                        <Link onClick={()=>{deleteUser(user.site)}} href="" className="card-link  btn-sm btn btn-danger">
                                            Delete
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
       </div>
    </main>
    <Footer />
</>
  );
}
