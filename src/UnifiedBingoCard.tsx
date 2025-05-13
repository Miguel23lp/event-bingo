import addIcon from './assets/addIcon.png';
import starIcon from './assets/star.svg';
import { BingoEventData } from './BingoCard';
import './UnifiedBingoCard.scss';

interface UnifiedBingoCardProps {
    nCols: number;
    nRows: number;
    events: BingoEventData[];
    onAddEvent?: () => void;
    getCellProps?: (ev: BingoEventData, index: number) => React.HTMLAttributes<HTMLDivElement>;
    renderCell?: (ev: BingoEventData, index: number) => React.ReactNode;
}

const UnifiedBingoCard = ({
    nCols,
    nRows,
    events,
    onAddEvent,
    getCellProps,
    renderCell,
}: UnifiedBingoCardProps) => {
    const centerIndex = Math.floor((nCols * nRows) / 2);
    const gridStyle: React.CSSProperties = {
        gridTemplateColumns: `repeat(${nCols}, 1fr)`,
        gridTemplateRows: `repeat(${nRows}, 1fr)`,
    };

    return (
        <section className="p-5">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <section className="bingo-grid" style={gridStyle}>
                    {Array.from(events, (event, index) => {


                        const extra = getCellProps?.(event, index) ?? {};
                        // display event cell
                        return (
                            <>
                                {index === centerIndex &&
                                    <div key="free" className="bingo-cell bingo-cell--free">
                                        <img src={starIcon} alt="Free" style={{ width: 150, height: 150 }} draggable={false} />
                                        <span>GRATIS</span>
                                    </div>
                                }
                                <div
                                    key={event!.id}
                                    {...extra}
                                    className={`bingo-cell 
                                        ${index%2==(
                                            (index<nCols*nRows/2-1)?0:1)?
                                            "":"bingo-cell--odd"} 
                                        ${extra.className ?? ""}`}
                                >
                                    {renderCell?.(event, index)}
                                    
                                    <div
                                        style={{
                                            position: 'relative',
                                            zIndex: 2
                                        }}>
                                        <p style={{
                                            color: "rgb(0, 0, 0)",
                                            fontFamily: "Roboto",
                                            fontWeight: "bold"
                                        }}>{event.title}</p>
                                        <p className="" style={{ fontFamily: "Arial", color: "#023047" }}>{event.description}</p>
                                        <p>{event.date.toLocaleString()}</p>
                                        <p className="text-start">{event.expectedResult}</p>
                                    </div>
                                </div>
                            </>
                        );
                    })}
                    {(events.length < nCols * nRows - 1) && (
                        <div key={"add"} className="bingo-cell bingo-cell--add" onClick={onAddEvent}>
                            <span style={{ marginBottom: 8 }}>Adicionar evento</span>
                            <img src={addIcon} alt="Add" style={{ width: 150, height: 150 }} draggable={false} />
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
};

export default UnifiedBingoCard;
