import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import {
	iniciarCronometro,
	pararCronometro,
	reiniciarCronometro,
	actualizarTiempo
} from '../redux/cronometroSlice';

export const useCronometroStore = () => {
	const dispatch = useDispatch();

	const { minutos, segundos, milisegundos, corriendo } = useSelector(state => state.cronometro);

	useEffect(() => {
		const intervalo = setInterval(() => {
			dispatch(actualizarTiempo());
		}, 10);

		return () => clearInterval(intervalo);
	}, []);

	const handleIniciar = () => {
		dispatch(iniciarCronometro());
	};

	const handleParar = () => {
		dispatch(pararCronometro());
	};

	const handleReiniciar = () => {
		dispatch(reiniciarCronometro());
	};

	return {
		minutos,
		segundos,
		milisegundos,
		corriendo,

		handleIniciar,
		handleParar,
		handleReiniciar,


	};
};
