'use client';
import Link from "next/link";
import Footer from "../include/footer";
import Header from "../include/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../include/firebase";
import { isLogin } from "../include/auth";

export default function Login() {
    const router = useRouter();
    const [loading, setLoading]= useState(false);
    const [message, setMessage] = useState("");

    const loginProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const jsonObject = {};
        formData.forEach((value, key) => {
            jsonObject[key] = value;
        });
       try { 
        const userRef = ref(db, `users/`+jsonObject['site']);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const user = snapshot.val();
          if(user.password==jsonObject['password']){
            setMessage("Redirecting to Dashbord...");
            if(jsonObject['site']=='localhost' || jsonObject['site']=='aman'){
              localStorage.setItem("isAdmin", true);
            }else{
              localStorage.setItem("isAdmin", false);
            }
            localStorage.setItem("isLogin", true);
            localStorage.setItem("user", jsonObject['site']);
            router.push("/");
          }else{
            setMessage("Invalid username or password");
          }
        } else {
          setMessage('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage('Error fetching user data');
      } finally {
        setLoading(false);
      }

    }
    useEffect(()=>{
      if(isLogin()){
        router.push("/");
      }
    })
  return (
    <>
    <Header />
    <main className="container">
       <div className="card">
            <div className="card-body ">
              <div className="bg-transparent text-center">
                <img src="assets/login.png" width="200"  />
              </div>
                {
                    message ? (<div className="alert alert-danger py-2 mt-4">
                        {message}
                    </div>) : ''
                }
                <form className="mt-4" onSubmit={loginProfile}>
                    <div className="form-group mb-3">
                        <label>Username</label>
                        <input  placeholder="Enter username" className="form-control readonly disabled border border-primary" name="site"  required />
                    </div>
                    <div className="form-group my-3">
                        <label>Password</label>
                        <input placeholder="Enter password" type="password" className="form-control readonly disabled border border-primary" name="password"  required />
                    </div>
                
                    <div className="form-group mb-3 mt-4">
                        <input type="submit" disabled={loading} className="btn w-100 btn-success" value="Submit"/>
                    </div>
                </form>
            </div>
       </div>
    </main>
    <Footer />
</>
  );
}
