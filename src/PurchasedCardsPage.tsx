import { useState, useEffect } from "react";
import { BingoCardData } from "./BingoCard.tsx";
import { BingoCardDisplay } from "./BingoCardDisplay.tsx";
import { User } from "./App.tsx";

function PurchasedCardsPage({ user }: { user: User | null }) {
    const [purchasedCards, setPurchasedCards] = useState<BingoCardData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
        ongoingCards: true,
        wonCards: false,
        lostCards: false,
    });

    useEffect(() => {
        if (!user) {
            setPurchasedCards([]);
            setLoading(false);
            return;
        }

        fetch('http://localhost:3000/users/cards', {
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
            .then(data => setPurchasedCards(data))
            .then(() => setLoading(false))
            .catch(error => {
                console.error('Error fetching purchased cards:', error.message);
                alert('Erro a carregar cartões: ' + error.message);
                setLoading(false);
            });
    }, [user]);

    // Filter cards by status
    const wonCards = purchasedCards.filter((card)=>card.result=="bingo"||card.result=="fullwin");
    const lostCards = purchasedCards.filter((card)=>card.result=="lost");
    const ongoingCards = purchasedCards.filter((card)=>card.result==null);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const renderCard = (card: BingoCardData) => (
        <div key={card.id} className="mb-5 card p-3">
            <h2 className="text-center">Cartão de Bingo #{card.id}</h2>
            <h3 className="text-center">Data de Criação: {card.creationDate.toLocaleString()}</h3>
            <h3 className="text-center">Preço: {card.price}€</h3>
            <h3 className="text-center">Prémio: {card.bingoPrize}€</h3>
            <h3 className="text-center">Prémio máximo: {card.maxPrize}€</h3>
            <h3 className="text-center">Celulas: {card.cells.length}</h3>
            <BingoCardDisplay cells={card.cells} nCols={card.nCols} nRows={card.nRows} />
        </div>
    );

    const renderSection = (title: string, cards: BingoCardData[], id: string, badgeColor: string) => {
        const isExpanded = expandedSections[id];
        return (
            <div className="card mb-4">
                <div className="card-header p-0">
                    <button
                        className={`btn btn-link w-100 text-start p-3 d-flex justify-content-between align-items-center ${isExpanded ? '' : 'collapsed'}`}
                        onClick={() => toggleSection(id)}
                        style={{ textDecoration: 'none' }}
                    >
                        <span className="h5 mb-0">{title}</span>
                        <span className={`badge ${badgeColor} ms-2`}>{cards.length}</span>
                    </button>
                </div>
                <div className={`collapse ${isExpanded ? 'show' : ''}`}>
                    <div className="card-body">
                        {cards.length === 0 ? (
                            <p className="text-center">Nenhum cartão nesta categoria</p>
                        ) : (
                            cards.map(renderCard)
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (!user) {
        return <h1>Por favor, faça login para ver seus cartões</h1>;
    }

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h1 className="text-center mb-4">Meus Cartões</h1>
            {purchasedCards.length === 0 ? (
                <h2 className="text-center">Você ainda não comprou nenhum cartão</h2>
            ) : (
                <div>
                    {renderSection("Cartões em Andamento", ongoingCards, "ongoingCards", "bg-primary")}
                    {renderSection("Cartões Ganhos", wonCards, "wonCards", "bg-success")}
                    {renderSection("Cartões Perdidos", lostCards, "lostCards", "bg-danger")}
                </div>
            )}
        </div>
    );
}

export default PurchasedCardsPage; 