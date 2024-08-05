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

      const loginUser = (id) => {
        setLoading(true); 
        if(id=='localhost' || id=='aman'){
           localStorage.setItem("isAdmin", true);  
        }else{
          localStorage.setItem("isAdmin", false);
        }
        localStorage.setItem("isLogin", true);
        localStorage.setItem("user", id);
        router.push("/");
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
                    {users.map((user, index) => (
                            <div className="col-12" key={user.site}>
                                <div className="card my-3 position-relative bg-danger p-1" >
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Site : {user.site}</li>
                                        <li className="list-group-item">Forward Phone : {user.phone}</li>
                                    </ul>
                                    
                                    <div className="card-body" style={{    position: "absolute",right: "-28px",top: "-29px"}}>
                                        <div className="btn-group">
                                          <button onClick={()=>{deleteUser(user.site)}} className="card-link  btn-sm btn btn-danger">
                                              Delete
                                          </button>
                                          <button onClick={()=>{loginUser(user.site)}}  className="card-link btn-sm btn btn-success">
                                              Login
                                          </button>
                                          <Link 
                                            href={`/users/add?site=${user.site}&phone=${user.phone}&pas=${user.password}`} 
                                            className="card-link btn-sm btn btn-primary"
                                          >
                                            Edit
                                          </Link>

                                        </div>
                                    </div>
                                    <div className="card-body" style={{    position: "absolute",left: "-25px",top: "-24px"}}>
                                        <div className="btn-group">
                                          <span  className="badge bg-danger">
                                              {index+1}
                                          </span>
                                        </div>
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
