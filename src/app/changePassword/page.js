'use client';
import Link from "next/link";
import Footer from "../include/footer";
import Header from "../include/header";
import { ref, update } from "firebase/database";
import { db } from "@/app/include/firebase";
import { useEffect, useState, Suspense } from "react";  
import { useRouter } from "next/navigation";
import { isLogin } from "../include/auth";
import { useSearchParams } from 'next/navigation';

const UsersContent = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [site, setSite] = useState("");

  useEffect(() => {
    setSite(localStorage.getItem("user"));
    if (typeof window !== "undefined" && !isLogin()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    setSite(localStorage.getItem("user"));
  }, []);

  const saveProfile = (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData(e.target);
    const jsonObject = {};
    formData.forEach((value, key) => {
      if (value !== '') {
        jsonObject[key] = value;   
      }
    });
    if(jsonObject['cpassword']!==jsonObject['password']){
      setMessage("Please enter same password");
      setLoading(false); 
      return false;
    }
    
    const o = {};
    o['password'] = jsonObject['password']
    const profilesRef = ref(db, 'users/' + site); 
    update(profilesRef, o)
      .then(() => {
        e.target.reset(); 
        setMessage("User Password Changed Successfully!");
      })
      .catch((error) => {
        console.error('Error saving data:', error);
        setMessage("Error saving data");
      })
      .finally(() => {
        setLoading(false);  
      });
  };

  return (
    <>
      <Header />
      <main className="container">
        <div className="card">
          <div className="card-body">
            <div className="d-flex flex-column justify-content-center align-items-center">
              <h2>Change Password</h2>
            </div>
            <hr className="m-0" />
            {message && (
              <div className="alert alert-success py-2 mt-4">
                {message}
              </div>
            )}
            
            <div className="card-container mt-4">
              <form className="mt-4" onSubmit={saveProfile}>
                
                <div className="form-group mb-3">
                  <label>New Password</label>
                  <input type="password" className="form-control border border-primary" name="cpassword"  placeholder="Enter New Password" required />
                </div>
                <div className="form-group mb-3">
                  <label>Confirm Password</label>
                  <input type="password" className="form-control border border-primary" name="password"  placeholder="Enter Confirm Password" required />
                </div>
                <div className="form-group mb-3 mt-4">
                  <input type="submit" disabled={loading} className="btn w-100 btn-success" value={loading ? "Submitting..." : "Submit"} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

const Users = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersContent />
    </Suspense>
  );
};

export default Users;
