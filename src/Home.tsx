import { useState, useEffect } from "react";
import { BingoCardData } from "./BingoCard.tsx";
import BingoCardDisplay from "./BingoCardDisplay";
import { User } from "./App.tsx";
import { useNavigate } from "react-router";


function Home({user, buyCard}: {user: User | null, buyCard: (cardId: number) => void}) {
    const navigate = useNavigate();
    const [bingoCards, setBingoCards] = useState<BingoCardData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        fetch('http://localhost:3000/cards')
            .then(response => response.json())
            .then(data => setBingoCards(data))
            .then(() => setLoading(false));
    }, []);

    if (loading) return (
    <div className="text-center">
        <div className="spinner-border" role="status" />
    </div>);

    return(<>
        {bingoCards.length == 0 && !loading && <h1>Não existem cartões disponíveis</h1>}
        {bingoCards.length > 0 && <h1>Cartões disponíveis</h1>}

        {bingoCards.map(card => 
            <div key={card.id}>
                <h1 className="text-center">Cartão de Bingo</h1>
                <h2 className="text-center">ID: {card.id}</h2>
                <h2 className="text-center">Data de Criação: {card.creationDate.toLocaleString()}</h2>
                <h2 className="text-center">Preço: {card.price}€</h2>
                <h2 className="text-center">Prémio: {card.bingoPrize}€</h2>
                <h2 className="text-center">Prémio máximo: {card.maxPrize}€</h2>
                <h2 className="text-center">Eventos: {card.events.length}</h2>
                <h2 className="text-center">Eventos por linha: {card.nRows}</h2>
                <h2 className="text-center">Eventos por coluna: {card.nCols}</h2>
                
                <div className="d-flex justify-content-center">
                    {user && user.role == "admin" && 
                    <div className="btn btn-warning" onClick={()=>{
                        navigate(`/atualizar_cartao/${card.id}`);
                    }}>Editar cartão</div>
                    }
                    <div className="btn btn-success p-auto" onClick={()=>buyCard(card.id)}>{`Comprar cartão ${card.price}€`}</div>
                </div>
                <BingoCardDisplay bingoCard={card} />
            </div>
        )}

    </>);
}

export default Home;