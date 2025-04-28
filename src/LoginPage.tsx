import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

interface LoginPageProps {
    login: (username: string, password: string) => Promise<boolean>;
}

function LoginPage({ login }: LoginPageProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [invalidLogin, setInvalidLogin] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        login(username, password).then(
            (valid)=>{
                setInvalidLogin(!valid);
                if (valid) {
                    navigate(from, { replace: true });
                }
                else {
                    setUsername("");
                    setPassword("");
                }
            }
        );
        
        
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column align-items-center">
            <h2>Login</h2>
            {invalidLogin && 
              <div className="invalid-feedback d-block">Credenciais inválidas!</div>
            }
            <input
                type="text"
                placeholder="Utilizador"
                className="form-control mb-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                className="form-control mb-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">Entrar</button>
        </form>
    );
}

export default LoginPage;
