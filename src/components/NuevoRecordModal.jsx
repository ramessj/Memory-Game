import { useMemo, useState } from 'react';
import Modal from 'react-modal';

import { Button, TextField, Typography } from '@mui/material';
import { useUiStore } from '../hooks/useUiStore';
import { useCronometroStore } from '../hooks/useCronometroStore';
import { useForm } from '../hooks/useForm';
import { useGameStore } from '../hooks/useGameStore';
import { useMemoryStore } from '../hooks/useMemoryStore';
import Swal from 'sweetalert2';

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: '50%',
		bottom: '50%',
	},
};

Modal.setAppElement('#root');

const formData = {
	name: '',
};

export const NuevoRecordModal = () => {
	const { isNewRecordModalOpen, closeModalNewRecord, startPostingNewRecord } =
		useUiStore();

	const { minutos, segundos, milisegundos } = useCronometroStore();

	const { onNewGame, gameOver, clickedCards } = useGameStore();

	const { isWin: isMemoryWin, onNewMemoryGame, flipCount } = useMemoryStore();

	const { name, onInputChange, formState } = useForm(formData);

	const recordData = useMemo(() => {
		const time = {
			minutes: minutos,
			seconds: segundos,
			miliseconds: milisegundos,
		};

		if (isMemoryWin) {
			const clicks = flipCount;
			const date = new Date().getTime();
			const gameMode = { modeName: 'Memory Match', modeId: 2 };

			return {
				clicks,
				date,
				gameMode,
				time,
			};
		} else if (gameOver) {
			const clicks = clickedCards.length;
			const date = new Date().getTime();
			const gameMode = { modeName: 'Memory All', modeId: 1 };

			return {
				clicks,
				date,
				gameMode,
				time,
			};
		}
	});

	const handleCloseRankingModal = () => {
		closeModalNewRecord();
	};

	const handleRecordSubmit = async (e) => {
		e.preventDefault();
		Swal.showLoading();
		const newRecord = { ...formState, ...recordData };
		const recordPosted = await startPostingNewRecord(newRecord);
		if (recordPosted) {
			Swal.fire(
				'Record posteado!',
				'Revisa el ranking para ver si eres de los mejores',
				'success'
			);
			closeModalNewRecord();
			if (isMemoryWin) {
				localStorage.setItem('memoryRecord', JSON.stringify(newRecord));
				onNewMemoryGame();
			} else if (gameOver) {
				localStorage.setItem('gameRecord', JSON.stringify(newRecord));
				onNewGame();
			}
		}
	};

	return (
		<Modal
			isOpen={isNewRecordModalOpen}
			style={customStyles}
			className="modal"
			overlayClassName="modalNuevoRecord-fondo"
			closeTimeoutMS={200}>
			<div
				className="modalContainer"
				style={{ padding: '1rem 2rem 0 2rem' }}>
				<form
					onSubmit={handleRecordSubmit}
					style={{
						margin: '2rem 1rem 0 1rem',
						display: 'flex',
						flexDirection: 'column',
						gap: '1rem',
					}}>
					<Typography textAlign={'center'} className="newRecordMsg">
						<strong>NUEVO RECORD</strong>
					</Typography>
					<Typography textAlign={'center'}>
						Tu tiempo:{' '}
						<strong>
							{recordData.time.minutes} :{' '}
							{recordData.time.seconds} :{' '}
							{recordData.time.miliseconds}
						</strong>
						<br />
						Clicks: <strong>{recordData.clicks}</strong>
					</Typography>
					<TextField
						autoFocus={true}
						autoComplete="new-password"
						name="name"
						onChange={onInputChange}
						label="Tu nombre"
						placeholder="Nombre"
						type="text"
						value={name}
					/>

					<Button
						style={{ marginTop: '1rem' }}
						variant="contained"
						fullWidth
						onClick={handleRecordSubmit}>
						Publicar Record
					</Button>

					<Button variant="text" onClick={handleCloseRankingModal}>
						Cancelar
					</Button>
				</form>
			</div>
		</Modal>
	);
};
