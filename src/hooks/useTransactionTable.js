import { useEffect, useState } from 'react';
import { WSS_EVENTS } from '../constants';
import { REACT_APP_TRANSACTION_REPORT_SERVER } from '../constants/api';

const { useWebsocket } = require('./useWebsocket');

const useWSTransaction = () => {
	const websocket = useWebsocket(REACT_APP_TRANSACTION_REPORT_SERVER);
	const [transactions, setTransactions] = useState(null);

	useEffect(() => {
		if (!websocket.current) return;
		websocket.current.onmessage = async socketEvent => {
			if (!socketEvent?.data) return;
			let { data } = socketEvent;
			const { action, ...rest } = JSON.parse(data || {});
			if (action !== WSS_EVENTS.rahat_claimed) return;
			const newTransaction = rest;
			setTransactions(newTransaction);
		};
	}, [websocket]);
	return [transactions, websocket];
};

export default useWSTransaction;
