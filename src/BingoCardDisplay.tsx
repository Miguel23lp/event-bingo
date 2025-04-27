import { Fragment } from "react/jsx-runtime";
import starIcon from "./assets/star.svg"
import { BingoEventData, BingoCardData } from "./BingoCard";

function BingoCardDisplay( { bingoCard }: { bingoCard: BingoCardData }) {

    const gridStyle: React.CSSProperties = {
        display: "grid",
        //placeItems: "center",
        gridTemplateColumns: `repeat(${bingoCard.nCols}, 1fr)`,
        gridTemplateRows: `repeat(${bingoCard.nRows}, 1fr)`,
        backgroundColor: '#f0f0f0', 
        borderRadius: '16px',       // Rounded corners for the container
        overflow: 'hidden',         // Ensures children are clipped to the rounded corners
    };

    return (
        <>
            <h1 className="text-center">Cartão de Bingo</h1>
            <h2 className="text-center">ID: {bingoCard.id}</h2>
            <h2 className="text-center">Data de Criação: {bingoCard.creationDate.toLocaleString()}</h2>
            <h2 className="text-center">Preço: {bingoCard.price}€</h2>
            <h2 className="text-center">Prémio: {bingoCard.bingoPrize}€</h2>
            <h2 className="text-center">Prémio máximo: {bingoCard.maxPrize}€</h2>
            <h2 className="text-center">Eventos: {bingoCard.events.length}</h2>
            <h2 className="text-center">Eventos por linha: {bingoCard.nRows}</h2>
            <h2 className="text-center">Eventos por coluna: {bingoCard.nCols}</h2>
            <section className="p-5">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: "relative",
                    }}>
                    <section style={gridStyle}>
                        {Array.from(bingoCard.events, (event, index)=>
                            <Fragment key={event.id}>
                                {(index == Math.floor(bingoCard.nCols*bingoCard.nRows/2))&&
                                    (<div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "200px",
                                            aspectRatio: "1",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background: "rgba(255, 204, 0, 0.6)",
                                            cursor: "default",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                        }}>
                                        <img draggable="false" style={{width:"150px", height:"150px"}} src={starIcon} />
                                        <span>GRATIS</span>
                                    </div>)}
                                
                                <div
                                    style={{
                                        width: "200px",
                                        aspectRatio: "1",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        background: `${index%2==((index<bingoCard.nCols*bingoCard.nRows/2-1)?0:1)?"rgb(255, 204, 0)":"rgb(255, 219, 76)"}`,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                    className={`card text-black rounded-0 p-3 table-bordered`}
                                    >
                                    <div 
                                    style={{
                                        position: 'relative',
                                        zIndex: 2 }}>
                                        <p style={{
                                            
                                            color: "rgb(0, 0, 0)", 
                                            fontFamily: "Roboto",
                                            fontWeight: "bold"
                                        }}>{event.title}</p>
                                        <p className="" style={{fontFamily: "Arial", color: "#023047"}}>{event.description}</p>
                                        <p>{event.date.toLocaleString()}</p>
                                        <p className="text-start">{event.expectedResult}</p>
                                    </div>
                                </div>
                                
                            </Fragment>
                        )}
                    </section>
                </div>
            </section>
        </>
    );
};

export default BingoCardDisplay;