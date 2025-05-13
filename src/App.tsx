import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Header from "./Header.tsx";
import Home from "./Home.tsx";
import LoginPage from "./LoginPage.tsx";
import CreateBingoCardPage from "./CreateBingoCardPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import UpdateBingoCardPage from "./UpdateBingoCardPage.tsx";
import { useNavigate } from "react-router";

export interface User {
    id: string;
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
    }, []);

    const setUserMoney = (money: number) => {
        setCurrentUser((prevUser) => {
            if (prevUser) {
                return { ...prevUser, money };
            }
            return prevUser;
        });
    };

    const buyCard = async (cardId: number) => {
        if (!currentUser) {
            return;
        }
        const response = await fetch(`http://localhost:3000/cards/${cardId}/buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUser.username, password: currentUser.password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(`Cartão comprado com sucesso! ID: ${cardId}`);
        } else {
            alert(data.message);
        }
    };


    async function login(username: string, password: string) {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const user = await response.json() as User;
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify({username: username, password: password}));
            return true;
        } else {
            console.log('Credenciais inválidas!');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        const navigate = useNavigate();
        navigate('/');
        setCurrentUser(null);
    };

    return loading ? (
        <h1>Loading...</h1>
    ) : (
        <Router>
            <Header user={currentUser} setUserMoney={setUserMoney} logout={logout} />
            <div className="p-4">
                {currentUser && (
                    <div>
                        <p>Bem-vindo, {currentUser.username} ({currentUser.role})</p>
                    </div>
                )}
                <Routes>
                    <Route index element={<Home user={currentUser} buyCard={buyCard}/>} />
                    <Route path="/login" element={<LoginPage login={login} />} />
                    <Route path="/criar_cartao" element={
                        <ProtectedRoute user={currentUser} admin>
                            <CreateBingoCardPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/atualizar_cartao/:id" element={
                        <ProtectedRoute user={currentUser} admin>
                            <UpdateBingoCardPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
