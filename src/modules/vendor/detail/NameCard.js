import React from 'react';
import { Card, CardTitle, Col, Row, Button } from 'reactstrap';

import '../../../assets/css/project.css';
import { truncateEthAddress } from '../../../utils';
import displayPic from '../../../assets/images/users/user_avatar.svg';
import { VENDOR_STATUS } from '../../../constants';

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;
const EXPLORER_URL = process.env.REACT_APP_BLOCKCHAIN_EXPLORER;

export default function DetailsCard(props) {
	const { vendorInfo, status } = props;
	let statusProps = { name: 'ACTIVE', color: 'success' };
	if (status === VENDOR_STATUS.NEW) statusProps = { name: 'AWAITING APPROVAL', color: 'info' };
	if (status === VENDOR_STATUS.SUSPENDED) statusProps = { name: 'SUSPENDED', color: 'danger' };

	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<Row>
						<Col>
							<CardTitle className="title" style={{ flexBasis: '70%' }}>
								{vendorInfo.name || 'Vendor'}
							</CardTitle>
						</Col>
						<Col>
							<div style={{ float: 'right' }}>
								<Button outline={true} color={statusProps.color} size="sm">
									{statusProps.name}
								</Button>
							</div>
						</Col>
					</Row>
					<Row>
						<Col md="8" sm="12" style={{ marginBottom: '10px' }}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<img
									src={
										vendorInfo.photo && vendorInfo.photo.length
											? `${IPFS_GATEWAY}/ipfs/${vendorInfo.photo[0]}`
											: displayPic
									}
									alt="user"
									className="rounded-circle"
									width="45"
								/>
								<div style={{ marginLeft: '20px' }}>
									<p className="card-font-medium">{vendorInfo.phone || '-'}</p>
									<div className="sub-title">Phone</div>
								</div>
							</div>
						</Col>
						<Col md="4" sm="12">
							<p className="card-font-medium">
								<a
									href={EXPLORER_URL + '/address/' + vendorInfo.wallet_address}
									target="_blank"
									rel="noopener noreferrer"
								>
									{truncateEthAddress(vendorInfo.wallet_address)}
								</a>
							</p>
							<div className="sub-title">Wallet Address</div>
						</Col>
					</Row>
				</div>
			</Card>
		</div>
	);
}
