import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Card, CardBody, CardTitle, Col, Label, Row } from 'reactstrap';
import confirm from 'reactstrap-confirm';
import { truncateEthAddress } from '../../utils';
import { BC } from '../../services/ChainService';
import { AppContext } from '../../contexts/AppSettingsContext';
import { getAdmins } from '../../services/appSettings';
import MaskLoader from '../global/MaskLoader';

export default function MultiSigTrigger() {
	const { wallet, appSettings } = useContext(AppContext);

	const [loading, showLoading] = useState(false);
	const [isTriggered, setIsTriggered] = useState(false);
	const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
	const [activated, setActivated] = useState(false);
	const [admins, setAdmins] = useState([]);

	const activateResponse = () => changeResponseStatus(true);
	const deactivateResponse = () => changeResponseStatus(false);

	const changeResponseStatus = async isActivate => {
		if (!(appSettings.agency?.contracts?.rahat_trigger && wallet)) return;
		const result = await confirm({
			title: 'Are you sure?',
			message: `You are providing your consent to ${
				activated ? 'deactivate' : 'activate'
			} this response. Your consent will be permanently recorded in blockchain. This will automatically activate the response if consents threshold is reached.`,
			confirmColor: 'danger',
			cancelText: 'Cancel',
			confirmText: 'Yes, I am sure, proceed!',
			size: 'md'
		});
		if (result) {
			showLoading(true);
			try {
				if (isActivate) {
					await BC.activateResponse(appSettings.agency.id, {
						contractAddress: appSettings.agency.contracts.rahat_trigger,
						wallet
					});
				} else {
					await BC.deactivateResponse(appSettings.agency.id, {
						contractAddress: appSettings.agency.contracts.rahat_trigger,
						wallet
					});
				}
				await fetchProjectStatus();
			} catch (e) {
				showLoading(false);
			}
		}
	};

	const fetchProjectStatus = useCallback(async () => {
		showLoading(true);
		BC.listTriggerConfirmations(appSettings.agency.id, {
			contractAddress: appSettings.agency.contracts.rahat_trigger,
			wallet
		})
			.then(async data => {
				let isLive = await BC.isProjectResponseLive({
					contractAddress: appSettings.agency.contracts.rahat_trigger,
					wallet
				});
				setActivated(isLive);

				let { data: dbAdmins } = await getAdmins();
				data = data.map(d => {
					const withAdminName = dbAdmins.find(ad => ad.address === d.address);
					return {
						name: withAdminName ? withAdminName.name : d.name,
						address: d.address,
						isConfirmed: d.isConfirmed
					};
				});
				const currentAdmin = data.find(ad => ad.address === wallet.address);
				if (currentAdmin) {
					setIsCurrentUserAdmin(true);
					setIsTriggered(currentAdmin.isConfirmed);
				}
				setAdmins(data);
			})
			.catch(e => console.log(e.message))
			.finally(e => showLoading(false));
	}, [appSettings, wallet]);

	useEffect(() => {
		if (!(appSettings.agency?.contracts && wallet)) return;
		fetchProjectStatus();
	}, [fetchProjectStatus]);

	return (
		<>
			<MaskLoader message="Loading data from Blockchain, please wait..." isOpen={loading} />
			<Card>
				<CardBody>
					<Row>
						<Col>
							<CardTitle className="title">Multi-Sig Trigger Response</CardTitle>
						</Col>
						<Col>
							{!activated ? (
								<button
									type="button"
									className="btn waves-effect waves-light btn-danger"
									style={{ borderRadius: '1px', float: 'right' }}
									disabled={true}
								>
									Not Activated
								</button>
							) : (
								<button
									type="button"
									className="btn waves-effect waves-light btn-success"
									style={{ borderRadius: '1px', float: 'right' }}
									disabled={true}
								>
									Activated
								</button>
							)}
						</Col>
					</Row>
					{admins.length ? (
						admins.map((d, i) => {
							return (
								<Row className="mt-2" key={d.address}>
									<Col sm="1"></Col>
									<Col sm="3" className="sub-title">
										{d.name}
									</Col>
									<Col sm="5" className="sub-title">
										{truncateEthAddress(d.address)}
									</Col>
									<Col sm="3" className="sub-title">
										{d.isConfirmed ? 'Triggered' : 'Not Triggered'}
									</Col>
								</Row>
							);
						})
					) : (
						<div className="sub-title">Admins loading...</div>
					)}
					<Row>
						<Col sm="12" className="mt-4 text-center">
							{isCurrentUserAdmin &&
								(isTriggered ? (
									<button
										type="button"
										className="btn waves-effect waves-light btn-outline-danger"
										style={{ borderRadius: '8px' }}
										value="0"
										onClick={deactivateResponse}
									>
										Deactivate Response
									</button>
								) : (
									<button
										type="button"
										className="btn waves-effect waves-light btn-outline-success"
										style={{ borderRadius: '8px' }}
										value="1"
										onClick={activateResponse}
									>
										Activate Response
									</button>
								))}
						</Col>
					</Row>
					<div className="mt-3">
						<small>Response is activated when at least two admins have triggered. </small>
					</div>
				</CardBody>
			</Card>
		</>
	);
}
