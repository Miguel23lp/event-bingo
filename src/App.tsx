import { useState } from 'react';
import Header from './Header.tsx'
import BingoCard from './BingoCard.tsx'
import { BingoEvent } from './BingoCard.tsx'
import CardEditor from './CardEditor.tsx';

const testEvents: BingoEvent[] =
  [
    { id: 1, title: "SL Benfica x Porto FC", description: "Futebol Liga Betclic", date: new Date("01/04/2025"), expectedResult: "SL Benfica", result: null },
    { id: 2, title: "Evento 2", description: "'Desporto' Liga 'Xxxx'", date: new Date("05/04/2025"), expectedResult: "Expected", result: null },
    { id: 3, title: "Evento 3", description: "'Desporto' Liga 'Xxxx'", date: new Date("01/04/2025"), expectedResult: "Expected", result: null },
    { id: 4, title: "Evento 4", description: "'Desporto' Liga 'Xxxx'", date: new Date("02/04/2025"), expectedResult: "Expected", result: null },
    { id: 5, title: "Evento 5", description: "'Desporto' Liga 'Xxxx'", date: new Date("03/04/2025"), expectedResult: "Expected", result: null },
    { id: 6, title: "Evento 6", description: "'Desporto' Liga 'Xxxx'", date: new Date("04/04/2025"), expectedResult: "Expected", result: null },
    { id: 7, title: "Evento 7", description: "'Desporto' Liga 'Xxxx'", date: new Date("06/04/2025"), expectedResult: "Expected", result: null },
    { id: 8, title: "Evento 8", description: "'Desporto' Liga 'Xxxx'", date: new Date("07/04/2025"), expectedResult: "Expected", result: null },
    { id: 9, title: "Evento 9", description: "'Desporto' Liga 'Xxxx'", date: new Date("08/04/2025"), expectedResult: "Expected", result: null },
    { id: 10, title: "Evento 10", description: "'Desporto' Liga 'Xxxx'", date: new Date("08/04/2025"), expectedResult: "Expected", result: null },
    { id: 11, title: "Evento 11", description: "'Desporto' Liga 'Xxxx'", date: new Date("09/04/2025"), expectedResult: "Expected", result: null },
    { id: 12, title: "Evento 12", description: "'Desporto' Liga 'Xxxx'", date: new Date("10/05/2025"), expectedResult: "Expected", result: null },
  ];

function App() {
  const [nCols, setNCols] = useState<number>(5);
  const [nRows, setNRows] = useState<number>(3);
  const [events, setEvents] = useState<BingoEvent[]>(testEvents);
  const [selectedEvent, setSelectedEvent] = useState<BingoEvent | null>(null);
  
  const isGridTooSmall = nRows * nCols <= events.length;

  const updateEvent = (event: BingoEvent, data: Partial<BingoEvent>) => {
    setEvents((prevEvents)=>{
      const newEvents = [...prevEvents];
      const index = newEvents.findIndex((e) => e.id === event.id);

      if (index !== -1) {
        newEvents[index] = { ...newEvents[index], ...data };
      }

      if (selectedEvent && selectedEvent.id == newEvents[index].id){
        setSelectedEvent(newEvents[index]);
      }
      return newEvents;
    });
  }

  const deleteEvent = (event: BingoEvent) => {
    setSelectedEvent(null);
    setEvents((prevEvents) => {
      const newEvents = prevEvents.filter(e=>e!=event);
      return newEvents;
    });
  }

  return (
    <>
      <Header></Header>

      <div style={{ display: 'flex', padding: '20px', gap: '20px' }}>
        
        {/* Bingo card left */}
        <div style={{flex: '1'}}>
          <BingoCard nCols={nCols} nRows={nRows} events={events} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} setEvents={setEvents}></BingoCard>
        </div>
        
        {/* Card settings right */}
        <div>
          <div className="d-flex justify-content-center">
            <div className="me-3">
              <label className="form-label">Colunas:</label>
              <input
                className={`form-control ${isGridTooSmall&&"is-invalid"}`}
                type="number"
                min="1"
                step="2"
                value={nCols}
                onChange={(e) => {
                  let value = isNaN(e.target.valueAsNumber)?1:e.target.valueAsNumber;
                  value = Math.max(value, 1);
                  value = value % 2 == 0 ? value + 1 : value;
                  setNCols(value);
                }}
              />
              
            </div>
          
            <div>
              <label className="form-label">Linhas:</label>
              <input
                className={`form-control ${isGridTooSmall&&"is-invalid"}`}
                type="number"
                min="1"
                step="2"
                value={nRows}
                onChange={(e) => {
                  if (isNaN(e.target.valueAsNumber)){
                    e.target.valueAsNumber=1;
                  }
                  const valor = Math.max(e.target.valueAsNumber, 1);
                  const impar = valor % 2 === 0 ? valor + 1 : valor;
                  setNRows(impar);
                  }
                }
              />
              
            </div>
          </div>
          <div>
            {isGridTooSmall && 
              <div className="invalid-feedback d-block text-center mb-1">Grelha muito pequena para número de eventos!</div>
            }
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            }}>
            <CardEditor selectedEvent={selectedEvent} updateEvent={updateEvent}></CardEditor>
            
          </div>
          {selectedEvent && (
              // button to delete event
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }} 
                className='btn btn-danger'
                onClick={()=>deleteEvent(selectedEvent)}
                >Apagar evento</div>

            )}

        </div>
      </div>
    </>
  )
}

export default App;
