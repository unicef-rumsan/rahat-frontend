import React, { useState, useContext } from 'react';
import { Card, CardBody, Button, Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import MaskLoader from '../global/MaskLoader';
import { TOAST } from '../../constants';
import { BC } from '../../services/ChainService';
import { AppContext } from '../../contexts/AppSettingsContext';

const Settings = props => {
	const { addToast } = useToasts();
	const { wallet, appSettings } = useContext(AppContext);

	const [loading, setLoading] = useState(null);

	const lib = {
		async syncBeneficiariesPins() {
			setLoading('Sending sync signal, please wait..."');
			if (!appSettings?.addresses?.server) return addToast('Must send server address', TOAST.ERROR);
			await BC.sendEth(appSettings?.addresses?.server, 0.0068, { wallet });
			addToast('Gsheet PIN sync has started. Please check admin email for completion confirmation.', TOAST.SUCCESS);
			setLoading(null);
		},
		async getOTPServerInfo() {
			setLoading('Sending command signal, please wait..."');
			if (!appSettings?.addresses?.server) return addToast('Must send server address', TOAST.ERROR);
			await BC.sendEth(appSettings?.addresses?.server, 0.0069, { wallet });
			addToast('Please check admin email for details.', TOAST.SUCCESS);
			setLoading(null);
		}
	};

	return (
		<>
			<MaskLoader message={loading} isOpen={loading !== null} />
			<Card>
				<CardBody style={{ float: 'right' }}>
					<Row>
						<Col>
							<Button onClick={lib.syncBeneficiariesPins}>Sync Beneficiaries PINs</Button>
						</Col>
						<Col>
							<Button onClick={lib.getOTPServerInfo}>Get OTP Server Info</Button>
						</Col>
						<Col>
							<Button hidden={true} onClick={lib.syncBeneficiariesPins}>
								Sync Beneficiaries PINs
							</Button>
						</Col>
						<Col>
							<Button hidden={true} onClick={lib.syncBeneficiariesPins}>
								Sync Beneficiaries PINs
							</Button>
						</Col>
					</Row>
				</CardBody>
			</Card>
		</>
	);
};

export default Settings;
