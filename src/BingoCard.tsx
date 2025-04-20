import addIcon from "./assets/addIcon.png"
import starIcon from "./assets/star.svg"
export interface BingoEvent {
    id: number;
    title: string;
    date: Date;
    description: string;
    expectedResult: string;
    result: string | null;
}

interface BingoCardProps {
    nCols: number;
    nRows: number;
    events: BingoEvent[];
    selectedEvent: BingoEvent | null;
    setSelectedEvent: (event: BingoEvent) => void;
    setEvents: (events: BingoEvent[]) => void;
}


function BingoCard({ nCols, nRows, events, selectedEvent, setSelectedEvent, setEvents }: BingoCardProps) {

    const reorderEvents = (fromEvent: BingoEvent, toEvent: BingoEvent) => {
        const updatedEvents = Array.from(events);
        const fromIndex = updatedEvents.indexOf(fromEvent);
        const toIndex = updatedEvents.indexOf(toEvent);
        const [removed] = updatedEvents.splice(fromIndex, 1);
        updatedEvents.splice(toIndex, 0, removed);
        setEvents(updatedEvents);
    };
    
    const onDrop = (toEvent: BingoEvent)=>{
        if (selectedEvent){
            reorderEvents(selectedEvent, toEvent);
        }
    }

    const addEvent = ()=>{
        const newEvents = Array.from(events);
        newEvents.push({id: events.length+1, title: `Novo evento (${events.length+1})`, date: new Date(), description: "Descrição", expectedResult: "Resultado", result: null})
        setEvents(newEvents);
    }


    const rows: BingoEvent[][] = [];
    for (let i = 0; i < events.length; i += nCols) {
        rows.push(events.slice(i, i + nCols));
    }

    const gridStyle: React.CSSProperties = {
        display: "grid",
        //placeItems: "center",
        gridTemplateColumns: `repeat(${nCols}, 1fr)`,
        gridTemplateRows: `repeat(${nRows}, 1fr)`,
        backgroundColor: '#f0f0f0', 
        borderRadius: '16px',       // Rounded corners for the container
        overflow: 'hidden',         // Ensures children are clipped to the rounded corners
    };

    return (
        <section className="p-5">
            <div
                style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: "relative",
                }}>
                <section style={gridStyle}>
                    {Array.from(events, (event, index)=>(
                        <>
                            {(index == Math.floor(nCols*nRows/2))&&
                                (<div
                                    key="Free"
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
                                key={index}
                                style={{
                                    width: "200px",
                                    aspectRatio: "1",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: `${index%2==((index<nCols*nRows/2-1)?0:1)?"rgb(255, 204, 0)":"rgb(255, 219, 76)"}`,
                                    cursor: "grab",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                                className={`card ${(index>nRows*nCols-2) && 'bg-danger'} text-black rounded-0 p-3 table-bordered`}
                                draggable={true}
                                
                                onDragExit={()=>{
                                    document.body.style.cursor = "pointer";
                                }}
                                
                                onDragStart={()=>{
                                    document.body.style.cursor = "grabbing";
                                    setSelectedEvent(event)
                                }}
                                onDragEnter={()=>{
                                    document.body.style.cursor = "drop"
                                }}
                                onDragOver={(e)=>{
                                    document.body.style.cursor = "default";
                                    e.preventDefault();
                                }}
                                onDrop={()=>onDrop(event)}
                                onClick={()=>setSelectedEvent(event)}
                                >

                                {/* Overlay when selected */}
                                {selectedEvent === event && (
                                    <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(0, 0, 0, 0.2)", // semi-transparent overlay
                                        border: "5px solid #FB8500", // border to highlight
                                        zIndex: 1,
                                        pointerEvents: "none", // allow clicks to pass through
                                    }}
                                    />
                                )}
                                <div style={{
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
                            
                        </>
                    )

                    )}
                    {(events.length<nCols*nRows-1) &&
                        (<div 
                            key={events.length-1}
                            style={{
                                width: "200px",
                                aspectRatio: "1",
                                display: "flex",            
                                flexDirection: "column",    
                                alignItems: "center",       
                                justifyContent: "center",   
                                background: "rgba(255, 204, 0, 0.4)",
                                border: "5px solid rgb(0.4,0.4,0.4)",
                                cursor: "pointer",
                            }}
                            onClick={addEvent}
                            > 
                                <span style={{fontFamily: "Roboto", fontWeight: "bolder", margin: "0.5rem" }}>Adicionar evento</span>
                                <img 
                                    style={{ width: "150px", height: "150px" }} 
                                    src={addIcon}
                                    draggable="false"
                                    ></img>
                            </div>)
                    }
                </section>
            </div>
        </section>
    );
    
};

export default BingoCard;