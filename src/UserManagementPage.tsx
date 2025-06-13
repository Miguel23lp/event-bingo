import { User } from "./App";
import { useEffect, useState } from "react";

function UserManagementPage({ user }: { user: User | null}) {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<Partial<User>[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [depositAmount, setDepositAmount] = useState<number>(0);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user.username,
                password: user.password
            }),
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errData => {
                    throw new Error(errData.message || response.statusText);
                });
            }
        })
            .then(data => setUsers(data.filter((u: Partial<User>) => u.role !== 'admin')))
            .then(() => setLoading(false))
            .catch(error => {
                console.error('Error fetching users: ', error.message);
                alert('Erro a carregar utilizadores: ' + error.message);
                setLoading(false);
            });
    }, [user]);

    const handleUserDeposit = (userId: number | undefined) => {
        if (!userId) return;
        setSelectedUserId(userId);
        setDepositAmount(0);
        setShowModal(true);
    };

    const handleDepositConfirm = () => {
        console.log(`Depositar ${depositAmount}€ ao utilizador com ID ${selectedUserId}`);

        if (selectedUserId === null || depositAmount <= 0) {
            alert("Por favor, selecione um utilizador e insira um valor válido.");
            return;
        }
        fetch(`http://localhost:3000/users/${selectedUserId}/deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: user?.username,
                password: user?.password,
                amount: depositAmount
            }),
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errData => {
                    throw new Error(errData.message || response.statusText);
                });
            }
        })
            .then(() => {
                alert(`Depósito de ${depositAmount}€ realizado com sucesso!`);
                setDepositAmount(0);
                setSelectedUserId(null);
                setShowModal(false);
            })
            .catch(error => {
                console.error('Erro ao depositar:', error.message);
                alert('Erro ao depositar: ' + error.message);
            });

        setShowModal(false);
    };

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">Gestão de Utilizadores</h2>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Procurar utilizador..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredUsers.length === 0 ? (
                <p className="text-muted text-center">Nenhum utilizador encontrado.</p>
            ) : (
                <div className="row">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card shadow-sm border-0 h-100">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 className="card-title">{user.username}</h5>
                                        <p className="card-text text-muted">ID: {user.id}</p>
                                    </div>
                                    <button
                                        className="btn btn-success mt-3 align-self-end"
                                        onClick={() => handleUserDeposit(user.id)}
                                    >
                                        💰 Depositar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Depositar Saldo</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                            </div>
                            <div className="modal-body">
                                <label htmlFor="deposit-input">Quantidade a depositar (€):</label>
                                <input
                                    id="deposit-input"
                                    type="number"
                                    className="form-control"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
                                    min={0}
                                />
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button className="btn btn-primary" onClick={handleDepositConfirm}>
                                    Confirmar Depósito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserManagementPage;