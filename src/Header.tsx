import { User } from "./App";
import LoginIcon from "./LoginIcon";
import UserMoneyDisplay from "./UserMoneyDisplay";

export default function Header({ user, setUserMoney, logout }: { user: User | null, setUserMoney: (money: number) => void, logout: () => void }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top border-bottom">
            <div className="container">
                <a className="navbar-brand" href="/">€vent Bingo</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><a className="nav-link" href="/">Início</a></li>
                        {user?.role == "admin" && <li className="nav-item"><a className="nav-link" href="/criar_cartao">Criar cartão</a></li>}
                        <LoginIcon user={user} logout={logout}></LoginIcon>
                        {user && <li className="nav-item"><UserMoneyDisplay user={user} setUserMoney={setUserMoney} /></li>}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
