'use client';
import Footer from "../include/footer";
import Header from "../include/header";
import { useEffect, useState } from "react";  
import getData from "../include/getData";
import { useRouter } from "next/navigation";
import { isLogin } from "../include/auth";

export default function Users() {
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState('form');
    const [selectedSite, setSelectedSite] = useState('');
    const router = useRouter();

    useEffect(() => {
        
        const checkLoginAndFetchData = async () => {
            if (!isLogin()) {
                router.push("/login");
                return;
            }
            await fetchSites();
            const storedSite = localStorage.getItem('user');
            if (storedSite) {
                setSelectedSite(storedSite);
                await fetchData(selectedOption, storedSite);
            }
        };

        checkLoginAndFetchData();
    }, [selectedOption,  selectedSite, router]);

    const fetchSites = async () => {
        try {
            // const usersList = await getUsers();
            // setSites(usersList);
        } catch (error) {
            console.error('Error fetching sites:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (option, site) => {
        setLoading(true);
        try {
            await getData(option, setUsers, site);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRadioChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
    };

    const handleSiteChange = (event) => {
        const value = event.target.value;
        setSelectedSite(value);
    };

    return (
        <>
            <Header />
            <main className="container">
                <div className="card">
                    <div className="card-body bg-danger">
                        <div className="d-flex flex-column justify-content-center align-items-center">
                            <h2 className="text-white">Data List ({users.length})</h2>
                        </div>
                        <hr className="m-0" />
                        <div className="form-group mt-4">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadio1"
                                    value="form"
                                    checked={selectedOption === 'form'}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label text-white" htmlFor="inlineRadio1">
                                    Form Data
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="inlineRadioOptions"
                                    id="inlineRadio2"
                                    value="sms"
                                    checked={selectedOption === 'sms'}
                                    onChange={handleRadioChange}
                                />
                                <label className="form-check-label text-white" htmlFor="inlineRadio2">
                                    SMS Data
                                </label>
                            </div>
                        </div>

                        <div className="card-container" style={{ fontSize: "small" }}>
                            {loading ? (
                                <div className="d-flex align-items-center justify-content-center h-100 my-5">
                                    <div className="spinner-border text-light" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="row">
                                    {users.map((user, index) => (
                                        <div className="col-12" key={user.id}>
                                            <div className={`card my-3 position-relative ${index % 2 === 0 ? 'even-background' : ''}`}>
                                                <ul className="list-group list-group-flush mt-3">
                                                    <li className="list-group-item text-center" key={`${user.id}_updated_at`}>
                                                        <u><strong><h6>{user.updated_at}</h6></strong></u>
                                                    </li>
                                                    <li className="list-group-item" key={`${user.id}_device`}>
                                                        Device: <strong>{user.Device}</strong>
                                                    </li>
                                                    {Object.entries(user).map(([key, value]) => {
                                                        if (['id', 'created_at', 'device', 'updated_at', 'Device'].includes(key)) return null;
                                                        return (
                                                            <li className="list-group-item" key={key}>
                                                                {key.charAt(0).toUpperCase() + key.slice(1)}: <strong>{value}</strong>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                                <div className="card-body" style={{    position: "absolute",left: "-25px",top: "-24px"}}>
                                                    <div className="btn-group">
                                                    <span className="badge bg-dark">
                                                        {index+1}
                                                    </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <style jsx>{`
                                    .even-background {
                                        background-color: #f2f2f2; /* Your desired background color for even cards */
                                    }
                                    `}</style>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
