import { User } from "./App";


function LoginIcon({ user, logout } : { user: User | null, logout: ()=>void }) {
    return user ? (
        <>
        <li className="nav-item">

            <a className="nav-link">
                <i style={{
                    color: user.role=="admin"?"gold":"black"
                }}
                className={"bi bi-person-circle"}></i> {user.username}
            </a>
        </li>
        <li className="nav-item">
            <a style={{cursor:"pointer"}} className="nav-link link-danger" onClick={logout}>
                Logout
            </a>
        </li>
        </>
    ) : (
        <li className="nav-item">
            <a className="nav-link" href="/login" aria-label="Login">
                Login
            </a>
        </li>
    );
}

export default LoginIcon;