import { BingoCellData } from "./BingoCard";

interface CardEditorProps {
    selectedCell: BingoCellData | null;
    updateCell: (cell: BingoCellData, data: Partial<BingoCellData>) => void
}

function CardEditor({selectedCell: selectedCell, updateCell: updateCell}: CardEditorProps) {

    return(
        <>
            {/* Right side: Editor for selected card */}
            <div style={{ minWidth: '250px' }}>
                {selectedCell? (
                <div className="w-100">
                    <h2>
                        Editar celula:
                    </h2>

                    {/* Edit title */}
                    <div className="form-floating mb-3">
                        <input
                        className="form-control"
                        type="text"
                        value={selectedCell.title}
                        maxLength={35}
                        onChange={(e) =>{
                            updateCell(selectedCell, { title: e.target.value })
                            }
                        }
                        />
                        <label>
                            Título:
                        </label>
                    </div>
                </div>
                ) : (
                <p>Selecione uma celula para editar.</p>
                )}
            </div>


        </>
    );
};

export default CardEditor;
