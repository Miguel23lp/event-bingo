export interface BingoEvent {
    id: number;
    title: string;
    date: string;
    description: string;
    expectedResult: string;
    result: string | null;
}

interface BingoCardProps {
    nCols: number;
    nRows: number;
    events: BingoEvent[];
}

function Card({ nCols, nRows, events }: BingoCardProps) {

    const rows: BingoEvent[][] = [];
    for (let i = 0; i < events.length; i += nCols) {
        rows.push(events.slice(i, i + nCols));
    }

    const gridStyle: React.CSSProperties = {
        display: "grid",
        //placeItems: "center",
        gridTemplateColumns: `repeat(${nCols}, 1fr)`,
        gridTemplateRows: `repeat(${nRows}, 1fr)`,
        borderRadius: '16px',       // Rounded corners for the container
        backgroundColor: '#f0f0f0', // Background to show the rounded corners
        overflow: 'hidden',         // Ensures children are clipped to the rounded corners
    };

    return (
        <section className="p-5">
            <div
                style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                
                //height: '100%', // Adjust this if you want vertical centering relative to a container
                }}>
                <section style={gridStyle}>
                    {Array.from(events, (event, index)=>(
                        <div
                            key={index}
                            style={{
                                aspectRatio: "1",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            className="card bg-info text-black rounded-0 p-3 table-bordered" 
                            draggable={true}
                            onClick={()=>console.log(event.id)}>
                            
                            <p className="text-success">{event.title}</p>
                            <p className="text-muted">{event.description}</p>
                            <p>{event.date}</p>
                            <p className="text-start">{event.expectedResult}</p>
                        </div>
                    )

                    )}
                </section>
            </div>
        </section>
    );
    
};

export default Card;