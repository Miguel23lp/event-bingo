import { BingoCellData } from "./BingoCard";
import { BingoCardDisplay } from "./BingoCardDisplay.tsx" ;


interface BingoCardCreateProps {
    nCols: number;
    nRows: number;
    title: string;
    cells: BingoCellData[];
    price: number;
    bingoPrize: number;
    maxPrize: number;
    date: Date;
    selectedCell: BingoCellData | null;
    setSelectedCell: (cell: BingoCellData) => void;
    setCells: (cells: BingoCellData[]) => void;
}


function BingoCardCreate({ nCols, nRows, title, cells, price, bingoPrize, maxPrize, date, selectedCell, setSelectedCell, setCells }: BingoCardCreateProps) {
    const reorderCells = (fromCell: BingoCellData, toCell: BingoCellData) => {
        const updatedCells = Array.from(cells);
        const fromIndex = updatedCells.indexOf(fromCell);
        const toIndex = updatedCells.indexOf(toCell);
        const [removed] = updatedCells.splice(fromIndex, 1);
        updatedCells.splice(toIndex, 0, removed);
        setCells(updatedCells);
    };

    const onDrop = (toCell: BingoCellData) => {
        if (selectedCell) {
            reorderCells(selectedCell, toCell);
        }
    }

    const addCell = () => {
        const newId = Number(Math.random().toString().slice(2));
        const newCells = Array.from(cells);
        newCells.push({
            id: newId,
            title: "Celula ",
            won: false
        });
        setCells(newCells);
    }

    const getCellProps = (cell: BingoCellData, index: number): React.HtmlHTMLAttributes<HTMLDivElement> => {
        return {
            className: [
                index > nRows * nCols - 2 && 'bg-danger',
                'bingo-cell--selectable',
                'bingo-cell--draggable',
                ' '
            ].filter(Boolean).join(' '),

            draggable: true,
            onClick: () => setSelectedCell(cell),

            onDragStart: () => {
                document.body.style.cursor = "grabbing";
                setSelectedCell(cell);
            },
            onDragEnter: () => {
                document.body.style.cursor = "drop";
            },
            onDragOver: (e) => {
                document.body.style.cursor = "default";
                e.preventDefault();
            },
            onDragExit: () => {
                document.body.style.cursor = "pointer";
            },
            onDrop: () => onDrop(cell),
        }
    }

    const renderCell = (cell: BingoCellData, _: number) => {
        return (
            <>
                {/* Drag handle */}
                <div className="drag-handle position-absolute top-0 start-0 p-2">
                    <i className="bi bi-grip-vertical"
                        style={{ fontSize: '1.2rem', opacity: 0.5 }} />
                </div>
                {/* Overlay when selected */ }
                {selectedCell?.id === cell.id && <div className="bingo-cell-overlay" />}
            </>
        );
    }

    return (
        <>
            <section>
                <BingoCardDisplay nCols={nCols} nRows={nRows} title={title} cells={cells} 
                    price={price} bingoPrize={bingoPrize} maxPrize={maxPrize} date={date}
                    onAddCell={addCell} getCellProps={getCellProps} renderCell={renderCell} />
            </section>
        </>
    );
};

export default BingoCardCreate;