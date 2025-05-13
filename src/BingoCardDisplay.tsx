import UnifiedBingoCard from "./UnifiedBingoCard";
import { BingoCardData } from "./BingoCard";

function BingoCardDisplay( { bingoCard }: { bingoCard: BingoCardData }) {

    return (
        <>
            <section>
                <UnifiedBingoCard nCols={bingoCard.nCols} nRows={bingoCard.nRows} events={bingoCard.events} />
            </section>
        </>
    );
};

export default BingoCardDisplay;