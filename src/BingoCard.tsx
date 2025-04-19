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
                position: "relative", // 👈 Needed for overlay
                }}>
                <section style={gridStyle}>
                    {Array.from(events, (event, index)=>(
                        <div
                            key={index}
                            style={{
                                aspectRatio: "1",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "200px", 
                                height: "200px",
                                background: "rgb(255, 204, 0)",
                                cursor: "grab",
                            }}
                            className={`card ${''/*selectedEvent==event?'bg-danger':'bg-info'*/} text-black rounded-0 p-3 table-bordered`}
                            draggable={true}
                            
                            onDragExit={(e)=>{
                                e.currentTarget.style.color = "black";
                            }}
                            onDragStart={()=>{
                                // set cursor to grabbing
                                document.body.style.cursor = "grabbing";
                                setSelectedEvent(event)
                            }}
                            onDragOver={(e)=>{
                                // set cursor to normal cursor
                                
                                e.currentTarget.style.color = "red";
                                document.body.style.cursor = "grab";
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
                                    textWrap: "nowrap",
                                    color: "rgb(0, 0, 0)", 
                                    fontFamily: "Roboto",
                                    fontWeight: "bold"
                                    }}>{event.title}</p>
                                <p className="" style={{fontFamily: "Arial", color: "#023047"}}>{event.description}</p>
                                <p>{event.date.toLocaleString()}</p>
                                <p className="text-start">{event.expectedResult}</p>
                            </div>
                        </div>
                    )

                    )}
                </section>
            </div>
        </section>
    );
    
};

export default BingoCard;