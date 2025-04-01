
export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand" href="#">Event Bingo</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="/">Início</a></li>
            <li className="nav-item"><a className="nav-link" href="/About">Sobre</a></li>
            <li className="nav-item"><a className="nav-link" href="/Logout">Contato</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
