import React, { useContext } from 'react';
import { Card, CardTitle, Col, Row, Button } from 'reactstrap';
import { AppContext } from '../../../contexts/AppSettingsContext';

export default function DetailsCard(props) {
	const { projectInfo, total_value } = props;
	const { appSettings } = useContext(AppContext);

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<Row>
						<Col>
							<CardTitle className="title" style={{ flexBasis: '70%' }}>
								{projectInfo.name || '---'}
							</CardTitle>
						</Col>
						<Col>
							<div style={{ float: 'right' }}>
								{appSettings?.agency?.default_project === projectInfo?.id && (
									<Button outline={true} color="success" size="sm">
										DEFAULT PROJECT
									</Button>
								)}
							</div>
						</Col>
					</Row>
					<Row>
						<Col md="8" sm="12" style={{ marginBottom: '10px' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ marginLeft: '20px' }}>
									<p className="card-font-medium">{projectInfo.location || '---'}</p>
									<div className="sub-title">Location</div>
								</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<p className="card-font-bold">{total_value}</p>
							<div className="sub-title">Allocated Budget</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
