import { useState, useEffect } from "react";
import { Routes, Route } from "react-router";
import Header from "./Header.tsx";
import Home from "./Home.tsx";
import LoginPage from "./LoginPage.tsx";
import CreateBingoCardPage from "./CreateBingoCardPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import UpdateBingoCardPage from "./UpdateBingoCardPage.tsx";
import PurchasedCardsPage from "./PurchasedCardsPage.tsx";
import UserManagementPage from "./UserManagementPage.tsx";
import { Tooltip } from 'bootstrap';

export interface User {
    id: number;
    username: string;
    password: string;
    role: 'user' | 'admin';
    money: number;
    purchases: number[];
}


function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            login(JSON.parse(storedUser).username, JSON.parse(storedUser).password).then((valid) => {
                if (!valid) {
                    localStorage.removeItem('user');
                }
                setLoading(false);
            });
        }
        else {
            setLoading(false);
        }

        // Initialize all tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl);
        });
    }, []);

    const setUserMoney = (money: number) => {
        setCurrentUser((prevUser) => {
            if (prevUser) {
                return { ...prevUser, money };
            }
            return prevUser;
        });
    };


    async function login(username: string, password: string) {
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                setCurrentUser(data);
                localStorage.setItem('user', JSON.stringify({username: username, password: password}));
                return true;
            } else {
                console.log(data.message || 'Credenciais inválidas!');
                return false;
            }
        } catch (error) {
            console.error('Error during login:', error instanceof Error ? error.message : 'Unknown error');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setCurrentUser(null);
        location.reload();
    };

    return loading ? (
        <h1>Loading...</h1>
    ) : (<>
            <Header user={currentUser} setUserMoney={setUserMoney} logout={logout} />
            <div className="p-4">
                {currentUser && (
                    <div>
                        <p>Bem-vindo, {currentUser.username} ({currentUser.role})</p>
                    </div>
                )}
                <Routes>
                    <Route index element={<Home user={currentUser}/>} />
                    <Route path="/login" element={<LoginPage login={login} />} />
                    <Route path="/meus_cartoes" element={
                        <ProtectedRoute user={currentUser} onlyUser>
                            <PurchasedCardsPage user={currentUser} />
                        </ProtectedRoute>
                    } />
                    <Route path="/criar_cartao" element={
                        <ProtectedRoute user={currentUser} onlyAdmin>
                            <CreateBingoCardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/gerir_utilizadores" element={
                        <ProtectedRoute user={currentUser} onlyAdmin>
                            <UserManagementPage user={currentUser}/>
                        </ProtectedRoute>
                    } />
                    <Route path="/atualizar_cartao/:id" element={
                        <ProtectedRoute user={currentUser} onlyAdmin>
                            <UpdateBingoCardPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </>
    );
}

export default App;
