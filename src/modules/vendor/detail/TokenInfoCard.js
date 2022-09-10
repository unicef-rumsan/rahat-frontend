import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';

import '../../../assets/css/project.css';

export default function TokenInfoCard(props) {
	const { balance, ethBalance } = props;

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
							<p className="card-font-bold">{ethBalance || '0'}</p>
							<div style={{ marginTop: 0 }} className="sub-title">
								Credit Balance (for fees)
							</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
