import React, { useCallback, useEffect } from 'react';
import { Card, CardBody, CardTitle, Col, Label, Row } from 'reactstrap';
import { Pie } from 'react-chartjs-2';

import { getBeneficiariesByPhone } from '../../services/stats';

const pieDataToken = {
	labels: [],
	datasets: [
		{
			data: [0, 0],
			backgroundColor: ['#999933', '#666699'],
			hoverBackgroundColor: ['#999933', '#666699']
		}
	]
};

export default function Chart(props) {
	const getData = useCallback(async () => {
		let labels = [];
		let data = [];
		let resData = await getBeneficiariesByPhone();
		if (resData && resData.length) {
			for (let d of resData) {
				if (d._id !== null) {
					let label = 'Unknown';
					if (d._id) label = `Yes Phone (${d.count})`;
					if (!d._id) label = `No Phone (${d.count})`;
					labels.push(label);
					data.push(d.count);
				}
			}
		}
		pieDataToken.labels = labels;
		pieDataToken.datasets[0].data = data;
	}, []);

	useEffect(() => {
		getData();
	}, []);

	return (
		<div>
			<Card>
				<CardBody>
					<Row>
						<Col>
							<CardTitle className="title">Phone Ownership Distribution</CardTitle>
						</Col>
					</Row>
					<div>
						<div
							className="chart-wrapper"
							style={{ width: '100%', marginBottom: '30px', marginTop: '10px', height: 340 }}
						>
							<Pie
								data={pieDataToken}
								options={{
									maintainAspectRatio: false,
									legend: {
										display: true,
										position: 'bottom',
										labels: {
											fontFamily: 'Be Vietnam',
											fontColor: '#9B9B9B'
										}
									}
								}}
							/>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
