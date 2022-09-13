import React, { useCallback, useEffect } from 'react';
import { Card, CardBody, CardTitle, Col, Label, Row } from 'reactstrap';
import { Pie, Doughnut } from 'react-chartjs-2';

import { getBeneficiariesByBank } from '../../services/stats';

const pieDataToken = {
	labels: [],
	datasets: [
		{
			data: [0, 0],
			backgroundColor: ['#336699', '#99CCFF'],
			hoverBackgroundColor: ['#336699', '#99CCFF']
		}
	]
};

export default function Chart(props) {
	const getData = useCallback(async () => {
		let labels = [];
		let data = [];
		let resData = await getBeneficiariesByBank();
		if (resData && resData.length) {
			for (let d of resData) {
				let label = 'Unknown';
				if (d._id) label = `Banked (${d.count})`;
				if (!d._id) label = `Unbanked (${d.count})`;
				labels.push(label);
				data.push(d.count);
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
							<CardTitle className="title">Banked vs. Unbanked</CardTitle>
						</Col>
					</Row>
					<div>
						<div
							className="chart-wrapper"
							style={{ width: '100%', marginBottom: '30px', marginTop: '10px', height: 340 }}
						>
							<Doughnut
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
