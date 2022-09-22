import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { AppContext } from '../../../contexts/AppSettingsContext';
import confirm from 'reactstrap-confirm';
import MaskLoader from '../../global/MaskLoader';
import useToasts from '../../../hooks/useToasts';
import { updateDefaultProject } from '../../../services/agency';

export default function BeneficiaryActions({ projectDetails }) {
	const history = useHistory();
	const { toastSuccess } = useToasts();

	const { appSettings, getAppSettings } = useContext(AppContext);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [loading, showLoading] = useState(false);

	const handlers = {
		dropdownToggle() {
			setDropdownOpen(prevState => !prevState);
		},
		async addBudget() {
			history.push(`/add-budget/${projectDetails.id}`);
		},
		async edit() {
			history.push(`/edit-project/${projectDetails.id}`);
		},
		async makeDefault() {
			const result = await confirm({
				title: 'Make this as a default project.',
				message: `All the Reports and current Palika project will be based on this project. Are you sure?`,
				confirmColor: 'danger',
				cancelText: 'Cancel',
				confirmText: 'Yes, I am sure',
				size: 'md'
			});
			if (result) {
				showLoading(true);
				if (appSettings.agency?.id && projectDetails.id) {
					await updateDefaultProject(appSettings.agency.id, projectDetails.id);
					await getAppSettings();
					toastSuccess('This project has been set as default project.');
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
					<DropdownItem onClick={handlers.addBudget}>Add Budget</DropdownItem>
					<DropdownItem onClick={handlers.edit}>Edit Project</DropdownItem>
					<DropdownItem
						hidden={appSettings?.agency?.default_project === projectDetails?.id}
						onClick={handlers.makeDefault}
					>
						Make as default project
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</>
	);
}
