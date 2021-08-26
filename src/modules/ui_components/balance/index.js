import React from 'react';
import { Card, CardTitle, Col, Row } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/project.css';

import Loading from '../../global/Loading';

export default function Balance(props) {
	const { title, data, button_name, label, projectId, fetching, action, handleIssueToken, loading } = props;
	const history = useHistory();
	const handleClick = () => {
		history.push(`/add_budget/${projectId}`);
	};
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<CardTitle className="title">{title || 'No Title'}</CardTitle>
					<Row>
						<Col>
							{fetching ? <Loading /> : <p className="card-font-bold">{data || '0'}</p>}

							<div style={{ marginTop: 0 }} className="sub-title">
								{label || 'No Label'}
							</div>
						</Col>
						<Col>
							{loading ? (
								<Loading />
							) : (
								<button
									type="button"
									className="btn waves-effect waves-light btn-outline-info"
									style={{ borderRadius: '8px', float: 'right' }}
									onClick={action === 'issue_token' ? handleIssueToken : handleClick}
								>
									{button_name || 'button'}
								</button>
							)}
						</Col>
					</Row>
					{/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div style={{ flexBasis: '70%' }}></div>
						<div style={{ flexBasis: '30%' }}></div>
					</div> */}
				</div>
			</Card>
		</div>
	);
}