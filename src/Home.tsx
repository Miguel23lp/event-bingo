import { useState, useEffect } from "react";
import { BingoCardData } from "./BingoCard.tsx";
import BingoCardDisplay from "./BingoCardDisplay";


function Home() {
    const [bingoCards, setBingoCards] = useState<BingoCardData[]>([]);

    useEffect(()=>{
        fetch('http://localhost:3000/cards')
            .then(response => response.json())
            .then(data => setBingoCards(data));
    }, []);

    return(<>
        {bingoCards.length == 0 && <h1>Não existem cartões disponíveis</h1>}
        {bingoCards.length > 0 && <h1>Cartões disponíveis</h1>}

        {bingoCards.map(card => 
            <div key={card.id}>
                <BingoCardDisplay bingoCard={card} />
            </div>
        )}

    </>);
}

export default Home;