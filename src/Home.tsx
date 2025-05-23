import { useState, useEffect } from "react";
import { BingoCardData } from "./BingoCard.tsx";
import { BingoCardDisplay } from "./BingoCardDisplay.tsx";
import { User } from "./App.tsx";
import { useNavigate } from "react-router";


function Home({ user, buyCard }: { user: User | null, buyCard: (cardId: number) => void }) {
    const navigate = useNavigate();
    const [bingoCards, setBingoCards] = useState<BingoCardData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetch('http://localhost:3000/cards' + (user?.role!="admin"?"/available":"/editable"))
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errData => {
                        throw new Error(errData.message || response.statusText);
                    });
                }
            })
            .then(data => setBingoCards(data))
            .then(() => setLoading(false))
            .catch(error => {
                console.error('Error fetching available cards:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="text-center">
            <div className="spinner-border" role="status" />
        </div>);

    return (<>
        {bingoCards.length == 0 && !loading && <h1>Não existem cartões disponíveis</h1>}
        {bingoCards.length > 0 && <h1>Cartões disponíveis</h1>}

        {bingoCards.map(card =>
            <div key={card.id} className="mb-5 p-4">
                <h1 className="text-center">Cartão de Bingo</h1>

                <BingoCardDisplay cells={card.cells} nCols={card.nCols} title={card.title} nRows={card.nRows} />
                <div className="d-flex justify-content-center">
                    {user?.role == "admin" &&
                        <button className="btn btn-warning" onClick={() => {
                            navigate(`/atualizar_cartao/${card.id}`);
                        }}>
                            <i className="bi bi-pencil-square me-2"></i>
                            Editar cartão
                        </button>
                    }
                    {user?.role == "user" &&
                        <button
                            className="btn btn-success w-auto d-flex align-items-center gap-2"
                            onClick={() => buyCard(card.id)}
                        >
                            <i className="bi bi-cart-plus"></i>
                            <span>Comprar cartão</span>
                            <span className="border-start ps-2">{card.price}€</span>
                        </button>
                    }   
                </div>
            </div>
        )}

    </>);
}

export default Home;