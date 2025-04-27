import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Header from "./Header.tsx";
import Home from "./Home.tsx";
import LoginPage from "./LoginPage.tsx";
import CreateBingoCardPage from "./CreateBingoCardPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";

// Simulação de utilizadores
const users = [
    { id: '1', username: 'admin', password: '1234', role: 'admin' },
    { id: '2', username: 'joao', password: '1234', role: 'user' },
];

export interface User {
    id: string;
    username: string;
    role: 'user' | 'admin';
}

function App() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (username: string, password: string) => {
        const found = users.find(u => u.username === username && u.password === password);
        if (found) {
            const user = { id: found.id, username: found.username, role: found.role as 'user' | 'admin' };
            setCurrentUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            return true;
        } else {
            alert('Credenciais inválidas');
            return false;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
    };

    return loading ? (
        <p>Loading</p>
    ) : (
        <Router>
            <Header user={currentUser} logout={logout} />
            <div className="p-4">
                {currentUser && (
                    <div>
                        <p>Bem-vindo, {currentUser.username} ({currentUser.role})</p>
                    </div>
                )}
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="/login" element={<LoginPage login={login} />} />
                    <Route path="/admin" element={
                        <ProtectedRoute user={currentUser} role="admin">
                            <CreateBingoCardPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
