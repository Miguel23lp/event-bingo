export interface BingoCellData {
    id: number;
    title: string;
    won: boolean;
}

export interface BingoCardData {
    id: number;
    title: string;
    description: string;
    date: Date;
    nRows: number;
    nCols: number;
    creationDate: Date;
    cells: BingoCellData[];
    price: number;
    bingoPrize: number;
    maxPrize: number;
    finished: boolean;
    result: "fullwin" | "bingo" | "lost" | null;
}