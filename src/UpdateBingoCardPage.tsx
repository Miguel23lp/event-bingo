import { useState, useEffect } from 'react';
import { BingoCardData, BingoEventData } from './BingoCard.tsx';
import UnifiedBingoCard from './UnifiedBingoCard.tsx';


function UpdateBingoCardPage() {
    const [bingoCard, setBingoCard] = useState<BingoCardData | null>(null);
    const [updating, setUpdating] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<BingoEventData | null>(null);

    const getCellProps = (event: BingoEventData, _: number): React.HtmlHTMLAttributes<HTMLDivElement> => {
        return {
            className: [
                event.result==null && 'bingo-cell--selectable',
            ].filter(Boolean).join(' '),
            onClick: () => {
                if (!event.result) {
                    setSelectedEvent(event);
                }
            },
        }
    }
    const renderCell = (event: BingoEventData, _: number) => {
        {/* Overlay when selected */ }
        if (selectedEvent?.id === event.id) {
            return (
                <div className="bingo-cell-overlay" />
            );
        }
        return null;
    }

    const handleUpdate = (updatedBingoCard: BingoCardData, updatedEvent: BingoEventData, state: "win" | "lose") => {
        setUpdating(true);
        if (updatedEvent.result != null) {
            alert("Evento já atualizado");
            setUpdating(false);
            return;
        }
        updatedBingoCard.events = updatedBingoCard.events.map((event) => {
            if (event.id === updatedEvent.id) {
                return { ...event, result: state };
            }
            return event;
        });

        let user = JSON.parse(localStorage.getItem('user') || '{}');
        fetch("http://localhost:3000/cards/" + updatedBingoCard.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ card: updatedBingoCard, username: user.username, password: user.password }),
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errData => {
                    throw new Error(errData.message || response.statusText);
                });
            }
        })
        .then((data) => {
            if (data) {
                updatedEvent.result = state;
                setBingoCard(data);
                setUpdating(false);
                setSelectedEvent(null);
                alert("Cartão bingo atualizado com sucesso!");
            }
        })
        .catch((error) => {
            alert("Erro a atualizar cartão bingo: " + error.message);
            setUpdating(false);
        });
    };

    // get bingo card id from url
    const bingoCardId = window.location.pathname.split('/').pop();
    // fetch bingo card data from server using bingoCardId
    useEffect(() => {
        fetch("http://localhost:3000/cards/" + bingoCardId)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then(errData => {
                        throw new Error(errData.message || response.statusText);
                    });
                }
            })
            .then(data => setBingoCard(data as BingoCardData))
            .catch(error => alert('Erro a carregar cartão bingo: ' + error.message));
    }, []);


    if (!bingoCard) return (
        <div className="text-center">
            <div className="spinner-border" role="status" />
        </div>
    );
    if (updating) return (
        <div className="text-center">
            <div className="spinner-border" role="status" />
        </div>
    );
    return (
        <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>

            {/* Bingo card left */}
            <div style={{ flex: '1' }}>
                <section>
                    <UnifiedBingoCard nCols={bingoCard.nCols} nRows={bingoCard.nRows} events={bingoCard.events}
                        getCellProps={getCellProps} renderCell={renderCell} />
                </section>
            </div>

            {/* Card settings right */}
            <div>
                <h2>Editor de evento</h2>
                <p>Selecione eventos e os marque como ganhos ou perdidos</p>
                <div style={{ minWidth: '250px' }}>
                    {selectedEvent ? (
                        <div style={{ width: '100%' }}>
                            <h2>Editar evento {selectedEvent.id}</h2>
                            <div className="d-flex justify-content-end">
                                <div className="m-5" style={{ width: '100%' }}>
                                    <button className='btn btn-success' onClick={()=>handleUpdate(bingoCard, selectedEvent, "win")}>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Marcar como ganho
                                    </button>
                                </div>
                                <div className="m-5" style={{ width: '100%' }}>
                                    <button className='btn btn-danger' onClick={()=>handleUpdate(bingoCard, selectedEvent, "lose")}>
                                        <i className="bi bi-x-circle-fill"></i>
                                        Marcar como perdido
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Selecione um evento para editar.</p>
                    )}
                </div>

            </div>
        </div>

    );
}

export default UpdateBingoCardPage;
