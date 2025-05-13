import UnifiedBingoCard from "./UnifiedBingoCard";
import { BingoCardData, BingoEventData } from "./BingoCard";

function BingoCardUpdate( { bingoCard, onUpdate, updating }
    : { bingoCard: BingoCardData, 
        onUpdate: (updatedBingoCard: BingoCardData, updatedEvent: BingoEventData, state: "win"|"lose") => void, 
        updating: boolean }) {
    
    
    return (
        <>
            <section>
                <UnifiedBingoCard nCols={bingoCard.nCols} nRows={bingoCard.nRows} events={bingoCard.events} />
            </section>
    
        </>
    );
}

export default BingoCardUpdate;