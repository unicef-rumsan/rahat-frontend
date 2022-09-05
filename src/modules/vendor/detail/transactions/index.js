import React, { useState, useContext, useCallback, useEffect } from 'react';

import TokenTab from './token';

const TransactionHistory = props => {
	const { transactions, fetching, vendorId } = props;

	return <TokenTab transactions={transactions} fetching={fetching} />;
};

export default TransactionHistory;
