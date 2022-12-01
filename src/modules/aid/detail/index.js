import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Row, Col, Tooltip } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import { AidContext } from '../../../contexts/AidContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import DetailsCard from '../../global/DetailsCard';
import ProjectInfo from './projectInfo';
import PieChart from './pieChart';
// import BarChart from './barChart';
import Tabs from './tab';
import { TOAST, PROJECT_STATUS, ROLES } from '../../../constants';
import BreadCrumb from '../../ui_components/breadcrumb';
import { getUser } from '../../../utils/sessionManager';
import { useHistory } from 'react-router-dom';
import API from '../../../constants/api';
import * as Service from '../../../services/aid';
import useProjectCache from '../../../hooks/useProjectCache';
import MaskLoader from '../../global/MaskLoader';

import CONTRACT from '../../../constants/contracts';
import ActionMenu from './ActionMenu';
import NameCard from './NameCard';
import { getContractByProviderWS } from '../../../blockchain/abi';

// --------------------------------------------------------------
let AdminContract;

export default function Index(props) {
	const { id } = props.match.params;

	//#region Contexts
	const { getAidDetails, changeProjectStatus } = useContext(AidContext);
	const { appSettings } = useContext(AppContext);
	//#endregion

	//#region States
	const [toolTipOpen, setToolTipOpen] = useState(false);
	const [projectDetails, setProjectDetails] = useState(null);
	const [loading, showLoading] = useState(false);
	//#endregion

	//#region Hooks

	const history = useHistory();
	const { addToast } = useToasts();
	const totalBudget = useProjectCache(Service.getProjectCapital, 'totalBudget', { id, defaultValue: 0 });
	const availableBalance = useProjectCache(Service.getProjectBalance, 'availableBalance', { id, defaultValue: 0 });

	//#endregion

	//#region Handlers

	const handleStatusChange = status => {
		const success_label = status === PROJECT_STATUS.CLOSED ? 'Closed' : 'Activated';
		changeProjectStatus(id, status)
			.then(d => {
				setProjectDetails(d);
				addToast(`Project has been ${success_label}`, TOAST.SUCCESS);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const fetchProjectDetails = () => {
		getAidDetails(id)
			.then(res => {
				setProjectDetails(res);
			})
			.catch(err => {
				addToast(err.message, TOAST.ERROR);
			});
	};

	const handleCampaignClick = () => {
		window.open(`${API.FUNDRAISER_FUNDRAISE}/${projectDetails.campaignId}`, '_blank');
	};
	const handleClick = () => {
		const currentUser = getUser();
		const isManager = currentUser && currentUser.roles.includes(ROLES.MANAGER);
		if (isManager || projectDetails.status === PROJECT_STATUS.SUSPENDED)
			return addToast('Access denied for this operation!', TOAST.ERROR);
		history.push(`/add-campaign/${id}`);
	};

	const toggleToolTip = () => {
		setToolTipOpen(!toolTipOpen);
	};

	//#endregion

	//#region useEffects

	useEffect(fetchProjectDetails, []);

	const listenChainEvents = useCallback(async () => {
		const { rahat_admin, rahat } = appSettings.agency.contracts;
		AdminContract = AdminContract || (await getContractByProviderWS(rahat_admin, CONTRACT.RAHATADMIN));
		AdminContract.on('ProjectERC20BudgetUpdated', a => {
			totalBudget.request(id, rahat_admin);
			availableBalance.request(id, rahat);
		});
	}, []);

	useEffect(() => {
		if (!appSettings?.agency?.contracts) return;
		const { rahat_admin, rahat } = appSettings.agency.contracts;
		totalBudget.request(id, rahat_admin);
		availableBalance.request(id, rahat);
		listenChainEvents();
		return () => AdminContract?.removeAllListeners();
	}, [appSettings]);

	//#endregion

	return (
		<>
			<MaskLoader message="Loading data from Blockchain, please wait..." isOpen={loading} />
			<Row>
				<Col md="9">
					<p className="page-heading">Projects</p>
					<BreadCrumb redirect_path="projects" root_label="Projects" current_label="Details" />
				</Col>

				<Col md="3" className="text-right pt-4">
					<ActionMenu projectDetails={projectDetails} />
				</Col>
			</Row>
			<Row>
				<Col md="7">
					{projectDetails && (
						<NameCard projectInfo={projectDetails} total_value={totalBudget.value} />
						// <DetailsCard
						// 	title="Project Details"
						// 	button_name="Generate QR Code"
						// 	name="Project Name"
						// 	name_value={projectDetails.name}
						// 	status={projectDetails.status}
						// 	total="Project Budget"
						// 	total_value={totalBudget.value}
						// 	handleStatusChange={handleStatusChange}
						// />
					)}
					{projectDetails && <ProjectInfo projectDetails={projectDetails} />}
				</Col>
				<Col md="5">
					{projectDetails && (
						<PieChart
							available_tokens={availableBalance.value}
							total_tokens={totalBudget.value}
							projectStatus={projectDetails.status}
							projectId={id}
						/>
					)}
				</Col>
			</Row>
			<Tabs projectId={id} />
		</>
	);
}
