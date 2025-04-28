import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Header from "./Header.tsx";
import Home from "./Home.tsx";
import LoginPage from "./LoginPage.tsx";
import CreateBingoCardPage from "./CreateBingoCardPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";


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

async function login(username: string, password: string) {
    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const found = await response.json();

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
