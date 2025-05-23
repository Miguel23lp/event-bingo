import { BingoCellData } from './BingoCard.tsx';
import './BingoCard.scss';

interface BingoCardDisplayProps {
    nCols: number;
    nRows: number;
    title: string;
    cells: BingoCellData[];
    onAddCell?: () => void;
    getCellProps?: (ev: BingoCellData, index: number) => React.HTMLAttributes<HTMLDivElement>;
    renderCell?: (ev: BingoCellData, index: number) => React.ReactNode;
}

const BingoCardDisplay = ({
    nCols,
    nRows,
    title,
    cells: cells,
    onAddCell: onAddCell,
    getCellProps,
    renderCell,
}: BingoCardDisplayProps) => {
    const centerIndex = Math.floor((nCols * nRows) / 2);
    const gridStyle: React.CSSProperties = {
        gridTemplateColumns: `repeat(${nCols}, 1fr)`,
        gridTemplateRows: `repeat(${nRows}, 1fr)`,
    };

    const getBingoCellClassName = (cell: BingoCellData, index: number, nCols: number, nRows: number): string => {
        let classes = "bingo-cell";
        if (!(index % 2 == ((index < nCols * nRows / 2 - 1)? 0 : 1))) {
            classes += " bingo-cell--odd";
        }
        if (cell.won) {
            classes += " bingo-cell--win";
        }
        return classes + " ";
    }

    return (
        <div className="bingo-container">
            <h1 className="bingo-title">{title}</h1>
            <section className="bingo-grid" style={gridStyle}>
                {Array.from(cells, (cell, index) => {
                    const extra = getCellProps?.(cell, index) ?? {};
                    
                    return (
                        <>
                            {
                                (index === centerIndex) && (
                                <div key="free" className="bingo-cell bingo-cell--free ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="bi bi-star-fill" viewBox='0 0 16 16'>
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </svg>
                                    <p>Gratis!</p>
                                </div>
                                )
                            }
                        
                            <div
                                key={cell.id}
                                {...extra}
                                className={getBingoCellClassName(cell, index, nCols, nRows) + (extra.className ?? "")}
                            >
                                {renderCell?.(cell, index)}
                                
                                <div className="position-relative w-100 h-100 d-flex flex-column justify-content-between align-items-center">
                                    {/* Content */}
                                    <div className="text-center w-100 px-2">
                                        <p className="title">{cell.title}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                })}
                
                {onAddCell!==undefined && (cells.length < nCols * nRows - 1) && (
                    <div className="bingo-cell bingo-cell--add" onClick={onAddCell}>
                        <i className="bi bi-plus-square-fill"></i>
                    </div>
                    /* 
                    <div key="add" className="bingo-cell bingo-cell--add" onClick={onAddCell}>
                        <span>Adicionar</span>
                        <img src={addIcon} alt="Add" draggable={false} />
                    </div> */
                    
                )}
            </section>
        </div>
    );
};

export { BingoCardDisplay };
