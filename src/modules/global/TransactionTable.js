import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { useTransactionTableContext } from '../../contexts/TransactionTableContext';
import useWSTransaction from '../../hooks/useTransactionTable';

const TransactionTable = () => {
	const { getListData } = useTransactionTableContext();
	const [wsTableData, websocket] = useWSTransaction() || [{ data: {} }, { current: null }];
	const [refreshCounter, setRefreshCounter] = useState(0);

	const [list, setList] = useState([]);

	useEffect(() => {
		if (!wsTableData?.data) return;
		setList(prev => [wsTableData?.data, ...prev]);
	}, [wsTableData]);

	useEffect(() => {
		return () => {
			websocket.close();
		};
	}, [refreshCounter]);

	const fetchTableData = async () => {
		const data = await getListData();
		setList(data);
	};

	useEffect(() => {
		fetchTableData();
	}, []);

	const changeTableColor = transactionDate =>
		moment().isBefore(moment(transactionDate).add(10, 'seconds')) ? { backgroundColor: '#f0f0f0', color: 'black' } : {};

	return (
		<div>
			<Table hover size="sm" responsive>
				<thead>
					<tr>
						<th>Timestamp</th>
						{/* <th>Transaction Hash</th> */}
						<th>Vendor</th>
						<th>Phone</th>
						<th>Amount</th>
						<th>Block Number</th>
					</tr>
				</thead>
				<tbody>
					{list.map((item, index) => {
						return (
							<tr style={changeTableColor(item.createdAt)}>
								<td>{moment(item.createdAt).fromNow()}</td>
								{/* <td>{item.txHash}</td> */}
								<td>{item.vendor}</td>
								<td>{item.phone}</td>
								<td>{item.amount}</td>
								<td>{item.blockNumber}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</div>
	);
};

export default TransactionTable;
