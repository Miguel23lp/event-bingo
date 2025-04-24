import { BingoCardData, BingoEventData } from "./BingoCard";

interface CardEditorProps {
    selectedEvent: BingoEventData | null;
    updateEvent: (event: BingoEventData, data: Partial<BingoEventData>) => void
}

function CardEditor({selectedEvent, updateEvent}: CardEditorProps) {

    return(
        <>
            {/* Right side: Editor for selected card */}
            <div style={{ minWidth: '250px' }}>
                {selectedEvent? (
                <div style={{ width: '100%'}}>
                    <h2>Editar evento {selectedEvent.id}</h2>

                    {/* Edit title */}
                    <div className="form-floating mb-3">
                        <input
                        className="form-control"
                        type="text"
                        value={selectedEvent.title}
                        onChange={(e) =>{
                            updateEvent(selectedEvent, { title: e.target.value })
                            }
                        }
                        />
                        <label>
                            Titulo:
                        </label>
                    </div>

                    {/* Edit description */}
                    <div className="form-floating mb-3">
                        <input
                        className="form-control"
                        type="text"
                        value={selectedEvent.description}
                        onChange={(e) =>{
                            updateEvent(selectedEvent, { description: e.target.value })
                            }
                        }
                        />
                        <label>
                            Descrição:
                        </label>
                    </div>
                    
                    {/* Edit date */}
                    <div className="form-floating mb-3">
                        <input
                        className="form-control"
                        type="datetime-local"
                        value={selectedEvent.date.toISOString().slice(0, 16)}
                        onChange={(e) =>
                            updateEvent(selectedEvent, { date: new Date(e.target.value) })
                        }
                        style={{ marginLeft: '5px' }}
                        />
                        <label>
                            Data:
                        </label>
                    </div>
                </div>
                ) : (
                <p>Selecione um evento para editar.</p>
                )}
            </div>

        </>
    );
};

export default CardEditor;
