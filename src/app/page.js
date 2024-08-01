'use client';
import Link from "next/link";
import Footer from "./include/footer";
import Header from "./include/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; 
import { ref, get, update } from "firebase/database"; 
import { db } from "./include/firebase";
import { isLogin } from "./include/auth";

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [phone, setPhone] = useState("");
    const [usersite, setUsersite] = useState("");
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    const saveProfile = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.target);
        const jsonObject = {};
        formData.forEach((value, key) => {
          jsonObject[key] = value;
        });
        const profilesRef = ref(db, 'users/' + localStorage.getItem('user'));
        update(profilesRef, jsonObject)
          .then(() => {
            e.target.reset();
            getUser();
            setMessage("Profile Updated Successfully");
          })
          .catch((error) => {
            console.error('Error saving data:', error);
            setMessage("Error saving data");
          })
          .finally(() => {
            setLoading(false);
          });
    };

    const getUser = async () => {
        const userRef = ref(db, `users/` + localStorage.getItem('user') + "/phone");
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            setPhone(snapshot.val());
        }
    };

    useEffect(() => {
        if (!isLogin()) {
            router.push("/login");
        } else {
            setUsersite(localStorage.getItem('user'));
            getUser().finally(() => {
                setIsInitialized(true);
            });
        }
    }, []);

    if (!isInitialized) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <main className="container">
                <div className="card">
                    <div className="card-body">
                        <h5>My Profile</h5>
                        {message && (
                            <div className="alert alert-success py-2 mt-4">
                                {message}
                            </div>
                        )}
                        <form className="mt-4" onSubmit={saveProfile}>
                            <div className="form-group mb-3">
                                <label>Forward Number</label>
                                <input
                                    className="form-control border border-primary"
                                    placeholder="Enter 10 Digit Phone Number"
                                    defaultValue={phone}
                                    inputMode="numeric"
                                    minLength="10"
                                    maxLength="10"
                                    name="phone"
                                    required
                                />
                            </div>
                            <div className="form-group mb-3 mt-4">
                                <input
                                    type="submit"
                                    disabled={loading}
                                    className="btn w-100 btn-success"
                                    value="Update Profile"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
