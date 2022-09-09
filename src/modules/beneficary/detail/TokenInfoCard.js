import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';

import '../../../assets/css/project.css';
import { formatBalanceAndCurrency } from '../../../utils';

export default function TokenInfoCard(props) {
	const { balance, totalIssued } = props;

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<Row>
						<Col>
							<CardTitle className="title">Token Details</CardTitle>
						</Col>
					</Row>
					<Row>
						<Col>
							<p className="card-font-bold">{balance || '0'}</p>
							<div style={{ marginTop: 0 }} className="sub-title">
								Current Balance
							</div>
						</Col>
						<Col>
							<p className="card-font-bold">{totalIssued || '0'}</p>
							<div style={{ marginTop: 0 }} className="sub-title">
								Total Issued
							</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
