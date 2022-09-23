import React, { useContext, useState, useCallback, useEffect } from 'react';
import { Card, CardTitle, Table, Row, Col } from 'reactstrap';
import GrowSpinner from '../../global/GrowSpinner';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { listVendorTxs } from '../../../services/ExplorerService';
import { truncateText } from '../../../utils';
import moment from 'moment';

const EXPLORER_URL = process.env.REACT_APP_BLOCKCHAIN_EXPLORER;
const TransactionList = ({ address }) => {
	const { appSettings } = useContext(AppContext);
	const [loading, showLoading] = useState(false);
	const [transactions, setTransactions] = useState([]);

	const getTxs = useCallback(async () => {
		const { agency } = appSettings;
		if (!agency || !agency.contracts) return;
		showLoading(true);
		let data = await listVendorTxs(agency.contracts.rahat, address);
		setTransactions(data);
		showLoading(false);
	}, []);

	useEffect(() => {
		getTxs();
	}, [getTxs]);

	return (
		<div className="main">
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">
						<Row>
							<Col md="6">Transaction History (Blockchain)</Col>
							<Col md="6"></Col>
						</Row>
					</CardTitle>
					{loading ? (
						<GrowSpinner />
					) : (
						<Table className="no-wrap v-middle" responsive>
							<thead>
								<tr className="border-0">
									<th className="border-0">Date</th>
									<th className="border-0">Transaction Hash</th>
									<th className="border-0">Beneficiary</th>
									<th className="border-0">Amount</th>
								</tr>
							</thead>
							<tbody>
								{transactions.length > 0 ? (
									transactions.map((tx, i) => {
										return (
											<tr key={i}>
												<td>{moment.unix(tx.timeStamp).format('YYYY-MM-DD HH:mm')}</td>
												<td>
													<a
														href={EXPLORER_URL + '/tx/' + tx.transactionHash}
														target="_blank"
														rel="noopener noreferrer"
													>
														{truncateText(tx.transactionHash)}
													</a>
												</td>
												<td>{tx.beneficiary}</td>
												<td>{tx.amount}</td>
											</tr>
										);
									})
								) : (
									<tr>
										<td colSpan={2}>No transaction available</td>
									</tr>
								)}
							</tbody>
						</Table>
					)}
				</div>
			</Card>

			<br />
		</div>
	);
};

export default TransactionList;
