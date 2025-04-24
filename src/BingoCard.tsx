export interface BingoEventData {
    id: number;
    title: string;
    date: Date;
    description: string;
    expectedResult: string;
    result: "win" | "lose" | null;
}

export interface BingoCardData {
    id: number;
    nRows: number;
    nCols: number;
    creationDate: Date;
    events: BingoEventData[];
}