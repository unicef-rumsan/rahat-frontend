import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import { useTransactionTableContext } from '../../contexts/TransactionTableContext';

const TransactionTable = () => {
	const { getListData } = useTransactionTableContext();
	const [list, setList] = useState([]);

	const fetchTableData = async () => {
		const data = await getListData();
		setList(data);
	};

	useEffect(() => {
		fetchTableData();
	}, []);

	return (
		<div>
			<Table hover size="sm">
				<thead>
					<tr>
						<th>SN</th>
						<th>Transaction Hash</th>
						<th>Vendor</th>
						<th>Phone</th>
						<th>Amount</th>
					</tr>
				</thead>
				<tbody>
					{list.map((item, index) => {
						return (
							<tr>
								<td>{index + 1}</td>
								<td>{item.txHash}</td>
								<td>{item.vendor}</td>
								<td>{item.phone}</td>
								<td>{item.amount}</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		</div>
	);
};

export default TransactionTable;
