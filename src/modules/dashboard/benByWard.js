import React, { useCallback, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, CardBody, CardTitle } from 'reactstrap';

import { getBeneficiariesByWard } from '../../services/stats';

const barChartData = {
	datasets: [
		{
			label: '# of Beneficiaries',
			backgroundColor: '#2B7EC1',
			stack: '2'
		}
	]
};

const barChartOptions = {
	maintainAspectRatio: false,
	legend: {
		display: true,
		position: 'bottom'
	},
	scales: {
		xAxes: [
			{
				gridLines: { display: false },
				barThickness: 40
			}
		],
		yAxes: [
			{
				gridLines: { borderDash: [4, 2] }
			}
		]
	}
};

const Index = props => {
	const getData = useCallback(async () => {
		let bar_labels = [];
		let bar_data = [];
		let locData = await getBeneficiariesByWard();
		if (locData && locData.length) {
			for (let d of locData) {
				if (d._id !== null) {
					bar_labels.push(d._id);
					bar_data.push(d.count);
				}
			}
		}

		bar_labels.sort((a, b) => a - b);

		barChartData.labels = bar_labels;
		barChartData.datasets[0].data = bar_data;
	}, []);

	useEffect(() => {
		getData();
	}, []);

	return (
		<div>
			<Card>
				<CardBody>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CardTitle>Beneficiaries by ward</CardTitle>
					</div>
					<br />
					<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 420 }}>
						{/* <Bar data={barChartData} options={barChartOptions} /> */}
						<Bar data={barChartData} options={barChartOptions} />
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default Index;
