import Header from './Header.tsx'
import Card from './Card.tsx'
import { BingoEvent } from './Card.tsx'
import { useState } from 'react';

function App() {
  const events: BingoEvent[]= [
    { id: 1, title: "SL Benfica x Porto FC", description: "Futebol Liga Betclic", date: "01/04/2025", expectedResult: "SL Benfica", result: null },
    { id: 2, title: "Evento 2", description: "'Desporto' Liga 'Xxxx'", date: "05/04/2025", expectedResult: "Expected", result: null },
    { id: 3, title: "Evento 3", description: "'Desporto' Liga 'Xxxx'", date: "10/04/2025", expectedResult: "Expected", result: null },
    { id: 4, title: "Evento 4", description: "'Desporto' Liga 'Xxxx'", date: "15/04/2025", expectedResult: "Expected", result: null },
    { id: 5, title: "Evento 5", description: "'Desporto' Liga 'Xxxx'", date: "20/04/2025", expectedResult: "Expected", result: null },
    { id: 6, title: "Evento 6", description: "'Desporto' Liga 'Xxxx'", date: "20/04/2025", expectedResult: "Expected", result: null },
    { id: 7, title: "Evento 7", description: "'Desporto' Liga 'Xxxx'", date: "20/04/2025", expectedResult: "Expected", result: null },
    { id: 8, title: "Evento 8", description: "'Desporto' Liga 'Xxxx'", date: "20/04/2025", expectedResult: "Expected", result: null },
    { id: 9, title: "Evento 9", description: "'Desporto' Liga 'Xxxx'", date: "25/04/2025", expectedResult: "Expected", result: null }
  ];
  
  const [nCols, setNCols] = useState<number>(3);
  const [nRows, setNRows] = useState<number>(2);



  return (
    <>
      <Header></Header>
      <div className="d-flex justify-content-center mb-4">
        <div className="me-3">
          <label className="form-label">Colunas:</label>
          <input
            type="number"
            min="2"
            value={nCols}
            onChange={(e) => {
              e.target.value = Math.max(Number(e.target.value), 1).toString();
              setNCols(Number(e.target.value))
              }}
            className="form-control"
          />
        </div>
        <div>
          <label className="form-label">Linhas:</label>
          <input
            type="number"
            min="2"
            value={nRows}
            onChange={(e) => {
              e.target.value = Math.max(Number(e.target.value), 1).toString();
              setNRows(Number(e.target.value))
              }
            }
            className="form-control"
          />
        </div>
      </div>
      <Card nCols={nCols}nRows={nRows} events={events} ></Card>
    </>
  )
}

export default App
