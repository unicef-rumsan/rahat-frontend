import React from 'react';
import { Card, CardTitle, Col, Row, Button } from 'reactstrap';

import '../../../assets/css/project.css';
import displayPic from '../../../assets/images/users/user_avatar.svg';
import { isPalika } from '../../../utils/checkRoles';

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

export default function DetailsCard(props) {
	const { benInfo, isActive } = props;

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<Row>
						<Col>
							<CardTitle className="title" style={{ flexBasis: '70%' }}>
								{isPalika() ? benInfo.name || 'Beneficiary' : benInfo.name?.substring(0, 1) + 'xxxxxxx Xxxxx'}
							</CardTitle>
						</Col>
						<Col>
							<div style={{ float: 'right' }}>
								<Button outline={true} color={isActive ? 'success' : 'danger'} size="sm">
									{isActive ? 'ACTIVE' : 'NOT ACTIVE'}
								</Button>
							</div>
						</Col>
					</Row>
					<Row>
						<Col md="8" sm="12" style={{ marginBottom: '10px' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<img
									src={benInfo.photo ? `${IPFS_GATEWAY}/ipfs/${benInfo.photo}` : displayPic}
									alt="user"
									className="rounded-circle"
									width="45"
								/>
								<div style={{ marginLeft: '20px' }}>
									<p className="card-font-medium">{benInfo.phone || '-'}</p>
									<div className="sub-title">Phone</div>
								</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<p className="card-font-bold">{benInfo.gender}</p>
							<div className="sub-title">Gender</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
