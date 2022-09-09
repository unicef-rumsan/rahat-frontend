import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { AppContext } from '../../../contexts/AppSettingsContext';
import confirm from 'reactstrap-confirm';
import { BC } from '../../../services/ChainService';
import { removeBeneficiary } from '../../../services/beneficiary';
import MaskLoader from '../../global/MaskLoader';

export default function BeneficiaryActions({ benInfo, handleIssueToken, handleAddToProject, refreshBeneficiaryData }) {
	const history = useHistory();

	const { appSettings, wallet } = useContext(AppContext);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [loading, showLoading] = useState(false);

	const handlers = {
		dropdownToggle() {
			setDropdownOpen(prevState => !prevState);
		},
		async suspendBeneficiary() {
			const result = await confirm({
				title: 'Suspend Beneficiary',
				message: `This will remove all the issued tokens from the beneficiary. Are you sure?`,
				confirmColor: 'danger',
				cancelText: 'Cancel',
				confirmText: 'Yes, I am sure',
				size: 'md'
			});
			if (result) {
				showLoading(true);
				try {
					if (appSettings?.agency?.contracts?.rahat && wallet && benInfo) {
						await BC.suspendBeneficiary(benInfo.phone, benInfo.currentProject.id, {
							contractAddress: appSettings.agency.contracts.rahat,
							wallet
						});
						refreshBeneficiaryData();
					}
				} catch (e) {
					console.log(e);
				} finally {
					showLoading(false);
				}
			}
		},
		async deleteBeneficiary() {
			const result = await confirm({
				title: 'Delete Beneficiary',
				message: `This will permanently delete beneficiary. Are you sure?`,
				confirmColor: 'danger',
				cancelText: 'Cancel',
				confirmText: 'Yes, I am sure',
				size: 'md'
			});
			if (result) {
				showLoading(true);
				if (benInfo?.id) {
					await removeBeneficiary(benInfo.id);
					history.push('/beneficiaries');
				}
				try {
				} catch (e) {
					console.log(e);
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
					<DropdownItem onClick={handleIssueToken}>Issue Token</DropdownItem>
					<DropdownItem onClick={() => history.push(`/edit-beneficiary/${benInfo.id}`)}>Edit Beneficiary</DropdownItem>
					<DropdownItem onClick={handleAddToProject}>Switch Project</DropdownItem>
					<DropdownItem divider />
					<DropdownItem hidden={!benInfo.balance} onClick={handlers.suspendBeneficiary} style={{ color: 'red' }}>
						Suspend Beneficiary
					</DropdownItem>
					<DropdownItem hidden={benInfo.balance} onClick={handlers.deleteBeneficiary} style={{ color: 'red' }}>
						Delete Beneficiary
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</>
	);
}
