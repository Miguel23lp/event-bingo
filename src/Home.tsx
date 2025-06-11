import { useState, useEffect } from "react";
import { BingoCardData } from "./BingoCard.tsx";
import { BingoCardDisplay } from "./BingoCardDisplay.tsx";
import { User } from "./App.tsx";
import { useNavigate } from "react-router";


function Home({ user }: { user: User | null }) {
    const [bingoCards, setBingoCards] = useState<BingoCardData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const parseCards = (data: any) : BingoCardData[] => {
        data.forEach((card: BingoCardData) => {
            card.date = new Date(card.date);
            card.creationDate = new Date(card.creationDate);
        });
        
        return data as BingoCardData[];
    }

    const removeCard = (cardId: number) => {
        setBingoCards(bingoCards.filter((card) => card.id != cardId));
    }

    const buyCard = async (cardId: number) => {
        if (!user) {
            navigate("/Login");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/cards/${cardId}/buy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: user.username, password: user.password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Cartão comprado com sucesso! ID: ${cardId}`);
                removeCard(cardId);
            } else {
                alert(data.message || response.statusText);
            }
        } catch (error) {
            alert('Erro ao comprar cartão: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
        }
    };

    useEffect(() => {
        let url= user?.role!="admin"? "/available":"/editable"
        if (user?.role=="user"){
            url += "/" + user!.id;
        }

        fetch('http://localhost:3000/cards' + url, {
            method: user?.role=="user"? 'POST':'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: user?.role=="user"? JSON.stringify({ username: user?.username, password: user?.password }): null,
        })
            .then(response => {
                if (response.ok) {
                    console.log(response);
                    return response.json();
                } else {
                    return response.json().then(errData => {
                        throw new Error(errData.message || response.statusText);
                    });
                }
            })
            .then(data => {setBingoCards(parseCards(data))})
            .then(() => setLoading(false))
            .catch(error => {
                console.error('Error fetching available cards:', error);
                setLoading(false);
            });
    }, []);

    if (loading) { 
        return (
            <div className="text-center">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    return (<>
        {bingoCards.length == 0 && !loading && <h1>Não existem cartões disponíveis</h1>}
        {bingoCards.length > 0 && <h1>Cartões disponíveis</h1>}

        {bingoCards.map(card =>
            <div key={card.id} className="mb-5 p-4">

                <BingoCardDisplay cells={card.cells} nCols={card.nCols} nRows={card.nRows} title={card.title} 
                    price={card.price} bingoPrize={card.bingoPrize} maxPrize={card.maxPrize} date={card.date}/>
                <div className="d-flex justify-content-center">
                    {user?.role == "admin" &&
                        <a className="btn btn-warning" href={`/atualizar_cartao/${card.id}`}>
                            <i className="bi bi-pencil-square me-2"></i>
                            Editar cartão
                        </a>
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