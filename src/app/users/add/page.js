'use client';
import Link from "next/link";
import Footer from "../../include/footer";
import Header from "../../include/header";
import { ref, update } from "firebase/database";
import { db } from "@/app/include/firebase";
import { useEffect, useState } from "react";  
import { useRouter } from "next/navigation";
import { isLogin } from "../../include/auth";

export default function Users() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true); // Ensure this code only runs on the client
        if (typeof window !== "undefined" && !isLogin()) {
            router.push("/login");
        }
    }, [router]);

    const saveProfile = (e) => {
        e.preventDefault();
        setLoading(true);  // Start loading

        const formData = new FormData(e.target);
        const jsonObject = {};
        formData.forEach((value, key) => {
          jsonObject[key] = value;
        });
        jsonObject['username'] = jsonObject['site'];
        const profilesRef = ref(db, 'users/'+jsonObject['site']); 
        update(profilesRef, jsonObject)
          .then(() => {
            e.target.reset(); 
            setMessage("User Added Successfully");
          })
          .catch((error) => {
            console.error('Error saving data:', error);
            setMessage("Error saving data");
          })
          .finally(() => {
            setLoading(false);  
          });
      };

    if (!isClient) {
        // Return null or a loading indicator while on the server
        return null;
    }

  return (
    <>
    <Header />
    <main className="container">
       <div className="card">
            <div className="card-body">
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <h2>Add User</h2>
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
                            <label>Username/Site</label>
                            <input className="form-control border border-primary" name="site" placeholder="Enter Site Name" required />
                        </div>
                        <div className="form-group mb-3">
                            <label>Forward Number</label>
                            <input className="form-control border border-primary" name="phone" placeholder="Enter 10 Digit Phone Number" inputMode="numeric" minLength="10" maxLength="10" required />
                        </div>
                        <div className="form-group mb-3">
                            <label>New Password</label>
                            <input className="form-control border border-primary" name="password" placeholder="Enter New Password" required />
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
}
