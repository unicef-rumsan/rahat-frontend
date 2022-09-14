import React, { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import { StatsCard } from '../ui_components/cards';
import { TOAST } from '../../constants';
import { UserContext } from '../../contexts/UserContext';
import MultiSigTrigger from './MultiSigTrigger';
import Map from '../../views/map/Map';

import { getBeneficiariesSummary } from '../../services/stats';

import BenByWard from './benByWard';
import BenByGender from './benByGender';
import BenByPhone from './benByPhone';
import BenByBank from './benByBank';

const Dashboard = () => {
	const { addToast } = useToasts();

	const [stats, setStats] = useState({
		total_children: 0,
		total_persons: 0,
		total_beneficiaries: 0,
		total_unbanked: 0,
		total_tokens: 0,
		total_redeem: 0
	});

	const fetchDashboardStats = () => {
		getBeneficiariesSummary()
			.then(d => {
				d.total_tokens = 0;
				d.total_redeem = 0;
				setStats(d);
			})
			.catch(() => {
				addToast('Internal server error!', TOAST.ERROR);
			});
	};

	useEffect(fetchDashboardStats, []);

	return (
		<>
			<Row>
				<Col md="6">
					<Row>
						<Col md="4">
							<StatsCard
								title="Beneficiaries"
								subtitle="persons"
								title_color="#2b7ec1"
								icon_color="#2b7ec1"
								icon_name="fas fa-clone"
								data={stats.total_beneficiaries}
							/>
						</Col>
						<Col md="4">
							<StatsCard
								title="Children Under 5"
								subtitle="children"
								title_color="#80D5AA"
								icon_color="#80D5AA"
								icon_name="fas fa-users"
								data={stats.total_children}
							/>
						</Col>
						<Col md="4">
							<StatsCard
								title="Total Impact"
								subtitle="persons"
								title_color="#F49786"
								icon_color="#F49786"
								icon_name="fas fa-money-bill-alt"
								data={stats.total_persons}
							/>
						</Col>
					</Row>
					<Row>
						<Col md="4">
							<StatsCard
								title="Unbanked"
								subtitle="persons"
								title_color="#F49786"
								icon_color="#F49786"
								icon_name="fas fa-user-plus"
								data={stats.total_unbanked}
							/>
						</Col>
						<Col md="4">
							<StatsCard
								title="Token Issued"
								subtitle="tokens"
								title_color="#F7C087"
								icon_color="#F7C087"
								icon_name="fas fa-microchip"
								data={stats.total_tokens}
							/>
						</Col>
						<Col md="4">
							<StatsCard
								title="Token Redeem"
								subtitle="tokens"
								title_color="#80D5AA"
								icon_color="#80D5AA"
								icon_name="fas fa-dollar-sign"
								data={stats.total_redeem}
							/>
						</Col>
					</Row>
				</Col>
				<Col md="6">
					<MultiSigTrigger />
				</Col>
			</Row>
			<Row>
				<Col md="4">
					<BenByGender />
				</Col>
				<Col md="4">
					<BenByBank />
				</Col>
				<Col md="4">
					<BenByPhone />
				</Col>
			</Row>
			<Row>
				<Col md="6">
					<BenByWard />
				</Col>
				<Col md="6">
					<Map height="515px" />
				</Col>
			</Row>
		</>
	);
};

export default Dashboard;
