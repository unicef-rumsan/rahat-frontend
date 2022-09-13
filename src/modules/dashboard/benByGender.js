import React, { useCallback, useEffect } from 'react';
import { Card, CardBody, CardTitle, Col, Label, Row } from 'reactstrap';
import { Pie } from 'react-chartjs-2';

import { getBeneficiariesByGender } from '../../services/stats';

const pieDataToken = {
	labels: ['Male', 'Female', 'Other', 'Unknown'],
	datasets: [
		{
			data: [0, 0, 0, 0],
			backgroundColor: ['#669999', '#CCCC66', '#CC6600', '#9999FF', '#0066CC', '#99CCCC'],
			hoverBackgroundColor: ['#669999', '#CCCC66', '#CC6600', '#9999FF', '#0066CC', '#99CCCC']
		}
	]
};

export default function Chart(props) {
	const getData = useCallback(async () => {
		let labels = [];
		let data = [];
		let resData = await getBeneficiariesByGender();
		if (resData && resData.length) {
			for (let d of resData) {
				let label = 'Unknown';
				if (d._id === 'F') label = `Female (${d.count})`;
				if (d._id === 'M') label = `Male (${d.count})`;
				if (d._id === 'O') label = `Other (${d.count})`;
				if (d._id === 'U') label = `Unknown (${d.count})`;
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
							<CardTitle className="title">Gender Distribution</CardTitle>
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
