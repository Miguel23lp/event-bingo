import { useEffect } from 'react';
import { User } from './App';

function UserMoneyDisplay({ user, setUserMoney }: { user: User, setUserMoney: (money: number) => void }) {

    useEffect(() => {
        if (!user) return;

        const ws = new WebSocket("ws://localhost:3000");
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'register', userId: user.id }));
        };

        ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
            console.log("websocket message: ", msg.data);
            if (data.type === 'moneyUpdate') {
                setUserMoney(data.money);
                user.money = data.money;
            }
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [user]);

    return (
        <div className="nav-item">
            <div className="nav-link">
                <i className="bi bi-cash"></i> {user.money.toFixed(2)}€
            </div>
        </div>
    );
};

export default UserMoneyDisplay;