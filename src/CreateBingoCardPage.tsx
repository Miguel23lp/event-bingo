import { useState } from 'react';
import { BingoCardData, BingoCellData } from './BingoCard.tsx';
import BingoCardCreate from './BingoCardCreate.tsx'
import CardEditor from './CardEditor.tsx';

const testCells: BingoCellData[] =
	[
		{ id: Number(Math.random().toString().slice(2)), title: "SL Benfica ganha", won: false },
	];


function CreateBingoCardPage() {
	const [title, setTitle] = useState<string>("Título");
	const [description, setDescription] = useState<string>("");
	const [date, setDate] = useState<Date>(new Date(Date.now()));
	const [nCols, setNCols] = useState<number>(5);
	const [nRows, setNRows] = useState<number>(3);
	const [price, setPrice] = useState<number>(1);
	const [bingoPrize, setBingoPrize] = useState<number>(1);
	const [maxPrize, setMaxPrize] = useState<number>(1);

	const [cells, setCells] = useState<BingoCellData[]>(testCells);
	const [selectedCell, setSelectedCell] = useState<BingoCellData | null>(null);

	const isGridTooSmall = nRows * nCols <= cells.length;

	const updateCell = (cell: BingoCellData, data: Partial<BingoCellData>) => {
		setCells((prevCells) => {
			const newCells = [...prevCells];
			const index = newCells.findIndex((e) => e.id === cell.id);

			if (index !== -1) {
				newCells[index] = { ...newCells[index], ...data };
			}

			if (selectedCell && selectedCell.id == newCells[index].id) {
				setSelectedCell(newCells[index]);
			}
			return newCells;
		});
	}

	const deleteCell = (cell: BingoCellData) => {
		if (!selectedCell) return;
		setSelectedCell(null);
		setCells((prevCells) => {
			const newCells = prevCells.filter(e => e.id != cell.id);
			return newCells;
		});
	}

	const handleUploadCard = () => {
		const newId = Number(Math.random().toString().slice(2));
		const card: BingoCardData = {
			id: newId, nCols: nCols, nRows: nRows, cells: cells,
			title: title, description: description,
			date: date, creationDate: new Date(Date.now()),
			price: price, bingoPrize: bingoPrize, maxPrize: maxPrize,
			result: null, finished: false
		};

		// check if grid is too small
		if (isGridTooSmall) {
			alert("Grelha muito pequena para número de celulas!");
			return;
		}
		// check if number of cells matches grid size
		if (cells.length != nCols * nRows - 1) {
			alert("Número de celulas não corresponde ao tamanho da grelha!");
			return;
		}
		if (cells.length < 1) {
			alert("O cartão tem de conter pelo menos uma celula!");
			return;
		}
		// check if cells are unique
		const uniqueCells = new Set(cells.map(cell => cell.id));
		if (uniqueCells.size != cells.length) {
			alert("Celulas não são únicos!");
			return;
		}
		const user = JSON.parse(localStorage.getItem('user') || '{}');
		fetch("http://localhost:3000/cards", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ card: card, username: user.username, password: user.password })
		}).then(response => {
			if (response.ok) {
				return response.json();
			} else {
				return response.json().then(errData => {
					throw new Error(errData.message || response.statusText);
				});
			}
		})
		.then(() => {
			alert("Cartão adicionado com sucesso!");
			location.reload();
		})
		.catch((error) => alert(`Erro a adicionar cartão: ${error.message}`));
	}



	const getDateFormat = (date: Date): string => {
		const minDigits = (s: number, digits: number) => (s.toString().length<digits)?"0".repeat(digits-s.toString().length).concat(s.toString()):s.toString();
		
		return minDigits(date.getUTCFullYear(),4) + "-" + minDigits(date.getUTCMonth()+1,2) + "-" + minDigits(date.getUTCDate(), 2) + " " + minDigits(date.getUTCHours(), 2) + ":" + minDigits(date.getUTCMinutes(), 2);
	}

	return (
		<>
			<h1>Criar Cartão Bingo</h1>
			<div style={{ display: 'flex', padding: '20px', gap: '20px' }}>

				{/* Bingo card left */}
				<div style={{ flex: '1' }}>
					<BingoCardCreate nCols={nCols} nRows={nRows} cells={cells} title={title} description={description}
						price={price} bingoPrize={bingoPrize} maxPrize={maxPrize} date={date}
						selectedCell={selectedCell} setSelectedCell={setSelectedCell} setCells={setCells}/>
				</div>

				{/* Card settings right */}
				<div style={{ maxWidth: "400px"}}>
					<h2>Editor de cartão</h2>
					<p>Arraste os quadrados na grelha para os mover.</p>

					<div className="d-flex justify-content-end">

						<div className="me-3">
							<label className="form-label">Título:</label>
							<input
								className="form-control"
								defaultValue={title}
								onChange={(e) => {
									setTitle(e.target.value);
								}}
							/>
						</div>

						<div className="me-3">
							<label className="form-label">Preço:</label>
							<input
								className={`form-control ${price<=0 && "is-invalid"}`}
								type="number"
								min="0"
								step=".01"
								defaultValue={price}
								onChange={(e) => {
									setPrice(e.target.valueAsNumber);
								}}
							/>
						</div>
					</div>


					<div className="me-3">
						<label className="form-label">Descrição</label>
						<textarea 
							className="form-control"
							onChange={(e) =>
								setDescription(e.target.value)
							}
						/>
					</div>

					
					<div className="me-3">
						<label className="form-label">Data:</label>
						<input
							className={`form-control ${date?.getTime() < new Date().getTime() && "is-invalid"}`}
							type="datetime-local"
							min={getDateFormat(new Date())}
							onChange={(e) => setDate(new Date(e.target.value))}
						/>
					</div>
					<div className="d-flex justify-content-end">
						<div className="me-3">
							<label className="form-label">Prémio bingo:</label>
							<input
								className="form-control"
								type="number"
								min="0"
								step=".01"
								defaultValue={bingoPrize}
								onChange={(e) => {
									setBingoPrize(e.target.valueAsNumber);
								}}
							/>
						</div>
						<div className="me-3">
							<label className="form-label">Prémio cartão completo:</label>
							<input
								className="form-control"
								type="number"
								min="0"
								step=".01"
								defaultValue={maxPrize}
								onChange={(e) => {
									setMaxPrize(e.target.valueAsNumber);
								}}
							/>
						</div>
					</div>

					<div className="d-flex justify-content-end">
						<div className="me-3">
							<label className="form-label">Colunas:</label>
							<input
								className={`form-control ${(isGridTooSmall||nCols%2!=1) && "is-invalid"}`}
								type="number"
								step="2"
								min="1"
								defaultValue={nCols}
								onChange={(e) => {
									if (isNaN(e.target.valueAsNumber)) {
										e.target.valueAsNumber = 1;
									}
									const valor = Math.max(e.target.valueAsNumber, 1);
									const impar = valor % 2 === 0 ? valor + 1 : valor;
									e.target.valueAsNumber = impar;
									setNCols(e.target.valueAsNumber);
								}}
							/>
							{nCols%2!=1 && <div className="invalid-feedback d-block text-end">Numero de colunas deve ser impar!</div>}
						</div>

						<div className="me-3">
							<label className="form-label">Linhas:</label>
							<input
								className={`form-control ${(isGridTooSmall||nRows%2!=1) && "is-invalid"}`}
								type="number"
								min="1"
								step="2"
								defaultValue={nRows}
								onChange={(e) => {
									if (isNaN(e.target.valueAsNumber)) {
										e.target.valueAsNumber = 1;
									}
									const valor = Math.max(e.target.valueAsNumber, 1);
									const impar = valor % 2 === 0 ? valor + 1 : valor;
									e.target.valueAsNumber = impar;
									setNRows(impar);
								}
								}
							/>
							{nRows%2!=1 && <div className="invalid-feedback d-block text-end">Numero de linha deve ser impar!</div>}
						</div>
					</div>
					<div className="me-3">
						{isGridTooSmall &&
							<div className="invalid-feedback d-block text-end">Grelha muito pequena para número de celulas!</div>
						}
					</div>
					<div className="d-flex m-3 justify-content-end">
						<div className={`btn btn-primary ${((date?.getTime() <= new Date().getTime()) || (cells.length !== nCols * nRows - 1 && cells.length < 1)) && "disabled"} `}
							onClick={handleUploadCard}
						>
							Adicionar Cartão
						</div>
					</div>
					<div className="me-3">
						<CardEditor selectedCell={selectedCell} updateCell={updateCell}></CardEditor>

					</div>

					{selectedCell && (
						// button to delete cell
						<div style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end',
						}}
							onClick={() => deleteCell(selectedCell)}
						>
							<button className="btn btn-danger me-3">
								Apagar celula
							</button>
						</div>

					)}


				</div>
			</div>

		</>
	)
}

export default CreateBingoCardPage;
