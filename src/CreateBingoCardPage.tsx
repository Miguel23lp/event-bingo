import { useState } from 'react';
import { BingoCardData, BingoEventData } from './BingoCard.tsx';
import BingoCardCreate from './BingoCardCreate.tsx'
import CardEditor from './CardEditor.tsx';

const testEvents: BingoEventData[] =
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


function CreateBingoCardPage() {
	const [nCols, setNCols] = useState<number>(5);
	const [nRows, setNRows] = useState<number>(3);
	const [price, setPrice] = useState<number>(0);
	const [bingoPrize, setBingoPrize] = useState<number>(0);
	const [maxPrize, setMaxPrize] = useState<number>(0);

	const [events, setEvents] = useState<BingoEventData[]>(testEvents);
	const [selectedEvent, setSelectedEvent] = useState<BingoEventData | null>(null);

	const isGridTooSmall = nRows * nCols <= events.length;

	const updateEvent = (event: BingoEventData, data: Partial<BingoEventData>) => {
		setEvents((prevEvents) => {
			const newEvents = [...prevEvents];
			const index = newEvents.findIndex((e) => e.id === event.id);

			if (index !== -1) {
				newEvents[index] = { ...newEvents[index], ...data };
			}

			if (selectedEvent && selectedEvent.id == newEvents[index].id) {
				setSelectedEvent(newEvents[index]);
			}
			return newEvents;
		});
	}

	const deleteEvent = (event: BingoEventData) => {
		if (!selectedEvent) return;
		setSelectedEvent(null);
		setEvents((prevEvents) => {
			const newEvents = prevEvents.filter(e => e != event);
			return newEvents;
		});
	}

	const handleUploadCard = () => {
		const newId = Number(Math.random().toString().slice(2));
		let card: BingoCardData = {
			id: newId, nCols: nCols, nRows: nRows, events: events,
			creationDate: new Date(Date.now()), price: price,
			bingoPrize: bingoPrize, maxPrize: maxPrize, result: null,
		};

		// check if grid is too small
		if (isGridTooSmall) {
			alert("Grelha muito pequena para número de eventos!");
			return;
		}
		// check if number of events matches grid size
		if (events.length != nCols * nRows - 1) {
			alert("Número de eventos não corresponde ao tamanho da grelha!");
			return;
		}
		if (events.length < 1) {
			alert("O cartão tem de conter pelo menos 1 evento!");
			return;
		}
		// check if events are unique
		const uniqueEvents = new Set(events.map(event => event.id));
		if (uniqueEvents.size != events.length) {
			alert("Eventos não são únicos!");
			return;
		}
		let user = JSON.parse(localStorage.getItem('user') || '{}');
		fetch("http://localhost:3000/cards", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ card: card, username: user.username, password: user.password })
		}).then(() => {
			alert("Cartão adicionado com sucesso!");
			setEvents([]);
			setNCols(5);
			setNRows(3);
			setSelectedEvent(null);
			setPrice(0);
			setBingoPrize(0);
			setMaxPrize(0);
		}).catch((res) => alert(`Erro a adicionar cartão: ${res}`));
	}

	return (
		<>

			<div style={{ display: 'flex', padding: '20px', gap: '20px' }}>

				{/* Bingo card left */}
				<div style={{ flex: '1' }}>
					<BingoCardCreate nCols={nCols} nRows={nRows} events={events} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} setEvents={setEvents}></BingoCardCreate>
				</div>

				{/* Card settings right */}
				<div>
					<h2>Editor de cartão</h2>
					<p>Arraste os eventos na grelha para os mover.</p>

					<div className="d-flex justify-content-end">

						<div className="me-3">
							<label className="form-label">Preço:</label>
							<input
								className={"form-control"}
								type="number"
								min="0"
								value={price}
								onChange={(e) => {
									let value = isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;
									value = Math.max(value, 0);
									setPrice(value);
								}}
							/>
						</div>
					</div>

					<div className="d-flex justify-content-end">
						<div className="me-3">
							<label className="form-label">Prémio bingo:</label>
							<input
								className={"form-control"}
								type="number"
								min="0"
								value={bingoPrize}
								onChange={(e) => {
									let value = isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;
									value = Math.max(value, 0);
									setBingoPrize(value);
								}}
							/>
						</div>
						<div className="me-3">
							<label className="form-label">Prémio cartão completo:</label>
							<input
								className={"form-control"}
								type="number"
								min="0"
								value={maxPrize}
								onChange={(e) => {
									let value = isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber;
									value = Math.max(value, 0);
									setMaxPrize(value);
								}}
							/>
						</div>
					</div>

					<div className="d-flex justify-content-end">
						<div className="me-3">
							<label className="form-label">Colunas:</label>
							<input
								className={`form-control ${isGridTooSmall && "is-invalid"}`}
								type="number"
								min="1"
								step="2"
								value={nCols}
								onChange={(e) => {
									let value = isNaN(e.target.valueAsNumber) ? 1 : e.target.valueAsNumber;
									value = Math.max(value, 1);
									value = value % 2 == 0 ? value + 1 : value;
									setNCols(value);
								}}
							/>

						</div>

						<div className="me-3">
							<label className="form-label">Linhas:</label>
							<input
								className={`form-control ${isGridTooSmall && "is-invalid"}`}
								type="number"
								min="1"
								step="2"
								value={nRows}
								onChange={(e) => {
									if (isNaN(e.target.valueAsNumber)) {
										e.target.valueAsNumber = 1;
									}
									const valor = Math.max(e.target.valueAsNumber, 1);
									const impar = valor % 2 === 0 ? valor + 1 : valor;
									setNRows(impar);
								}
								}
							/>

						</div>
					</div>
					<div className="me-3">
						{isGridTooSmall &&
							<div className="invalid-feedback d-block text-end">Grelha muito pequena para número de eventos!</div>
						}
					</div>
					<div className="d-flex m-3 justify-content-end">
						<div className={`btn btn-primary ${events.length !== nCols * nRows - 1 || events.length < 1 ? "disabled" : ""} `}
							onClick={handleUploadCard}
						>
							Adicionar Cartão
						</div>
					</div>
					<div className="me-3">
						<CardEditor selectedEvent={selectedEvent} updateEvent={updateEvent}></CardEditor>

					</div>

					{selectedEvent && (
						// button to delete event
						<div style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
						}}
							onClick={() => deleteEvent(selectedEvent)}
						>
							<button className="btn btn-danger me-3">
								Apagar evento
							</button>
						</div>

					)}


				</div>
			</div>

		</>
	)
}

export default CreateBingoCardPage;
