import React, { useContext, createContext } from 'react';

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
		return data.data;
	};

	const contextValue = {
		...initialState,
		getListData
	};

	return <TransactionTableContext.Provider value={contextValue}>{children}</TransactionTableContext.Provider>;
};

export const useTransactionTableContext = () => useContext(TransactionTableContext);
