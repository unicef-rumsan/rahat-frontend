import React, { useContext, useReducer } from 'react';
import { createContext } from 'react';
import { getTableData } from '../services/transactionReportTable';

const initialState = {
	transactions: [],
	loading: false,
	getListData: () => {}
};

export const TransactionTableContext = createContext(initialState);

export const TransactionTableContextProvider = ({ children }) => {
	// const [state,dispatch] = useReducer()

	const getListData = async () => {
		const data = await getTableData();
		console.log('data', data);
		return data.data;
	};

	const contextValue = {
		...initialState,
		getListData
	};

	return <TransactionTableContext.Provider value={contextValue}>{children}</TransactionTableContext.Provider>;
};

export const useTransactionTableContext = () => useContext(TransactionTableContext);
