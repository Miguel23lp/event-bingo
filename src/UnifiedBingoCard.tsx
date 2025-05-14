import addIcon from './assets/addIcon.png';
import starIcon from './assets/star.svg';
import { BingoEventData } from './BingoCard';
import './BingoCard.scss';

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
        gap: 0,
    };

    const getBingoCellClassName = (event: BingoEventData, index: number, nCols: number, nRows: number): string => {
        let classes = "bingo-cell";
        if (!(index % 2 == ((index < nCols * nRows / 2 - 1)? 0 : 1))) {
            classes += " bingo-cell--odd";
        }
        if (event.result) {
            classes += " bingo-cell--" + event.result;
        }
        return classes + " ";
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <section className="bingo-grid" style={gridStyle}>
                {Array.from(events, (event, index) => {
                    const extra = getCellProps?.(event, index) ?? {};
                    
                    return (
                        <>
                            {
                                (index === centerIndex) && (
                                <div key="free" className="bingo-cell bingo-cell--free">
                                    <img src={starIcon} alt="Free" style={{ width: 100, height: 100 }} draggable={false} />
                                        <span>GRATIS</span>
                                    </div>
                                )
                            }
                        
                            <div
                                key={event.id}
                                {...extra}
                                className={getBingoCellClassName(event, index, nCols, nRows) + (extra.className ?? "")}
                            >
                                {renderCell?.(event, index)}

                                <div className="position-relative w-100 h-100 d-flex flex-column justify-content-between align-items-center">
                                    {/* Content */}
                                    <div className="text-center w-100 px-2">
                                        <p className="title">{event.title}</p>
                                        <p className="description">{event.description}</p>
                                        <p className="date">{formatDate(event.date)}</p>
                                        <p className="expected-result">{event.expectedResult}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                })}
                
                {(events.length < nCols * nRows - 1) && (
                    <div key="add" className="bingo-cell bingo-cell--add" onClick={onAddEvent}>
                        <span>Adicionar evento</span>
                        <img src={addIcon} alt="Add" style={{ width: 80, height: 80 }} draggable={false} />
                    </div>
                )}
            </section>
        </div>
    );
};

export default UnifiedBingoCard;
