import { useState, useEffect } from 'react';
import { BingoCardData, BingoCellData } from './BingoCard.tsx';
import { BingoCardDisplay } from "./BingoCardDisplay" ;
import { useNavigate } from 'react-router';


function UpdateBingoCardPage() {
    const [bingoCard, setBingoCard] = useState<BingoCardData | null>(null);
    const [updating, setUpdating] = useState(false);
    const [selectedCell, setSelectedCell] = useState<BingoCellData | null>(null);
    const navigate = useNavigate();

    const getCellProps = (cell: BingoCellData): React.HtmlHTMLAttributes<HTMLDivElement> => {
        return {
            className: [
                !cell.won && 'bingo-cell--selectable',
            ].filter(Boolean).join(' '),
            onClick: () => {
                if (!cell.won) {
                    setSelectedCell(cell);
                }
            },
        }
    }
    const renderCell = (cell: BingoCellData) => {
        {/* Overlay when selected */ }
        if (selectedCell?.id === cell.id) {
            return (
                <div className="bingo-cell-overlay" />
            );
        }
        return null;
    }

    const setCellWon = (updatedBingoCard: BingoCardData, updatedCell: BingoCellData) => {
        setUpdating(true);
        if (updatedCell.won) {
            alert("Celula já foi marcada!");
            setUpdating(false);
            return;
        }

        let user = JSON.parse(localStorage.getItem('user') || '{}');
        fetch(`http://localhost:3000/cards/${updatedBingoCard.id}/cellWon/${updatedCell.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: user.username, password: user.password }),
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errData => {
                    throw new Error(errData.message || response.statusText);
                });
            }
        })
        .then(() => {
            console.log("Cell updated");
            updatedBingoCard.cells = updatedBingoCard.cells.map((cell) => {
                if (cell.id === updatedCell.id) {
                    return { ...cell, won: true };
                }
                return cell;
            });
                
            setBingoCard(updatedBingoCard);
            setUpdating(false);
            setSelectedCell(null);
            //alert("Cartão bingo atualizado com sucesso!");
        })
        .catch((error) => {
            alert("Erro a atualizar cartão bingo: " + error.message);
            setUpdating(false);
        });
    };

    const setCardFinished = (updatedBingoCard: BingoCardData) => {
        setUpdating(true);
        let user = JSON.parse(localStorage.getItem('user') || '{}');
        fetch(`http://localhost:3000/cards/${updatedBingoCard.id}/finish`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: user.username, password: user.password }),
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errData => {
                    throw new Error(errData.message || response.statusText);
                });
            }
        })
        .then(() => {
            console.log("Card updated");
            updatedBingoCard.finished = true;
            setBingoCard(null);
            navigate(-1);
            //alert("Cartão bingo atualizado com sucesso!");
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


    
    if (updating || !bingoCard) return (
        <div className="text-center">
            <div className="spinner-border" role="status" />
        </div>
    );
    return (
        <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>

            {/* Bingo card left */}
            <div style={{ flex: '1' }}>
                <section>
                    <BingoCardDisplay nCols={bingoCard.nCols} nRows={bingoCard.nRows} title={bingoCard.title} description={bingoCard.description}
                        price={bingoCard.price} bingoPrize={bingoCard.bingoPrize} maxPrize={bingoCard.maxPrize} date={bingoCard.date}
                        cells={bingoCard.cells} getCellProps={getCellProps} renderCell={renderCell} />
                </section>

                <div className="d-flex justify-content-center">
                    <div className="btn btn-danger" style={{width: "fit-content"}} onClick={()=>setCardFinished(bingoCard)}>
                        <i className="bi bi-x-circle-fill"></i>
                        Marcar evento como concluído
                    </div>
                </div>
            </div>

            {/* Card settings right */}
            <div>
                <h2>Editor de evento</h2>
                <p>Selecione celulas e marque-as em caso de acerto</p>
                <div style={{ minWidth: '250px' }}>
                    {selectedCell ? (
                        <div style={{ width: '100%' }}>
                            <h2>Editar celula</h2>
                            <div className="d-flex justify-content-end">
                                <div className="m-5" style={{ width: '100%' }}>
                                    <button className='btn btn-success' onClick={()=>setCellWon(bingoCard, selectedCell)}>
                                        <i className="bi bi-check-circle-fill"></i>
                                        Marcar como ganho
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>Selecione uma celula para editar.</p>
                    )}
                </div>
            </div>
        </div>

    );
}

export default UpdateBingoCardPage;
