import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { AppContext } from '../../../contexts/AppSettingsContext';
import confirm from 'reactstrap-confirm';
import { VENDOR_STATUS } from '../../../constants';
import { BC } from '../../../services/ChainService';
import MaskLoader from '../../global/MaskLoader';

export default function ActionMenu({
	vendorInfo,
	vendorStatus,
	handleApproveVendor,
	handleAddToProject,
	fetchVendorStatus
}) {
	const history = useHistory();

	const { appSettings, wallet } = useContext(AppContext);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [loading, showLoading] = useState(false);

	const handlers = {
		dropdownToggle() {
			setDropdownOpen(prevState => !prevState);
		},
		async changeStatus(status) {
			const result = await confirm({
				title: 'Suspend Beneficiary',
				message: `This will remove all the issued tokens from the beneficiary. Are you sure?`,
				confirmColor: 'danger',
				cancelText: 'Cancel',
				confirmText: 'Yes, I am sure',
				size: 'md'
			});
			if (result) {
				const _status = status === true ? VENDOR_STATUS.ACTIVE : VENDOR_STATUS.SUSPENDED;
				showLoading(true);
				try {
					if (appSettings?.agency?.contracts?.rahat && wallet && vendorInfo) {
						await BC.changeVendorStatus(vendorInfo.wallet_address, status, {
							contractAddress: appSettings.agency.contracts.rahat,
							wallet
						});
						fetchVendorStatus(vendorInfo);
					}
				} catch (e) {
				} finally {
					showLoading(false);
				}
			}
		}
	};

	return (
		<>
			<MaskLoader message="Loading data from Blockchain, please wait..." isOpen={loading} />
			<Dropdown isOpen={dropdownOpen} toggle={handlers.dropdownToggle}>
				<DropdownToggle caret className="btn-outline-primary" color="light">
					Actions
				</DropdownToggle>
				<DropdownMenu>
					{vendorStatus === VENDOR_STATUS.NEW ? (
						<DropdownItem onClick={handleApproveVendor} style={{ color: 'green' }}>
							Approve Vendor
						</DropdownItem>
					) : (
						<>
							<DropdownItem onClick={() => history.push(`/edit-vendor/${vendorInfo.id}`)}>Edit Vendor</DropdownItem>
							<DropdownItem onClick={handleAddToProject}>Add to Project</DropdownItem>
							<DropdownItem divider />
							<DropdownItem
								hidden={vendorStatus === VENDOR_STATUS.SUSPENDED}
								onClick={() => handlers.changeStatus(false)}
								style={{ color: 'red' }}
							>
								Suspend Vendor
							</DropdownItem>
							<DropdownItem
								hidden={vendorStatus === VENDOR_STATUS.ACTIVE}
								onClick={() => handlers.changeStatus(true)}
								style={{ color: 'green' }}
							>
								Activate Vendor
							</DropdownItem>
						</>
					)}
				</DropdownMenu>
			</Dropdown>
		</>
	);
}
