import { Link } from "react-router";
import { User } from "./App";
import LoginIcon from "./LoginIcon";
import UserMoneyDisplay from "./UserMoneyDisplay";

export default function Header({ user, setUserMoney, logout }: { user: User | null, setUserMoney: (money: number) => void, logout: () => void }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top border-bottom">
            <div className="container">
                <Link className="navbar-brand" to="/">€vent Bingo</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Início</Link></li>
                        {user?.role == "user" && <li className="nav-item"><Link className="nav-link" to="/meus_cartoes">Meus Cartões</Link></li>}
                        {user?.role == "admin" && <li className="nav-item"><Link className="nav-link" to="/criar_cartao">Criar cartão</Link></li>}
                        {user?.role == "admin" && <li className="nav-item"><Link className="nav-link" to="/gerir_utilizadores">Gerir Utilizadores</Link></li>}
                        <LoginIcon user={user} logout={logout}></LoginIcon>
                        {user?.role == "user" && <li className="nav-item"><UserMoneyDisplay user={user!} setUserMoney={setUserMoney} /></li>}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
