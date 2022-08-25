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
import DataService from '../../../services/db';
import * as Service from '../../../services/aid';
import useProjectCache from '../../../hooks/useProjectCache';

import CONTRACT from '../../../constants/contracts';
import { getContractByProvider } from '../../../blockchain/abi';

// --------------------------------------------------------------

export default function Index(props) {
	const { id } = props.match.params;

	// ------------------- Contexts -----------------------------
	const { getAidDetails, changeProjectStatus } = useContext(AidContext);
	const { appSettings } = useContext(AppContext);

	// ------------------- States -----------------------------
	const [toolTipOpen, setToolTipOpen] = useState(false);
	const [projectDetails, setProjectDetails] = useState(null);

	// ------------------- Hooks ------------------------------
	const history = useHistory();
	const { addToast } = useToasts();
	const totalBudget = useProjectCache(Service.getProjectCapital, 'totalBudget', { id, defaultValue: 0 });
	const availableBalance = useProjectCache(Service.getProjectBalance, 'availableBalance', { id, defaultValue: 0 });

	// ------------------- Handlers ---------------------------
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

	// ------------------- useEffects ---------------------------
	useEffect(fetchProjectDetails, []);

	const listenChainEvents = async () => {
		const { rahat_admin } = appSettings.agency.contracts;
		const AdminContract = await getContractByProvider(rahat_admin, CONTRACT.RAHATADMIN);
		AdminContract.on('ProjectERC20BudgetUpdated', a => {
			totalBudget.request(id, rahat_admin);
			availableBalance.request(id, rahat_admin);
		});
	};

	useEffect(() => {
		const { rahat_admin } = appSettings.agency.contracts;
		totalBudget.request(id, rahat_admin);
		availableBalance.request(id, rahat_admin);
		listenChainEvents();
	}, []);

	return (
		<>
			<Row>
				<Col md="9">
					<p className="page-heading">Projects</p>
					<BreadCrumb redirect_path="projects" root_label="Projects" current_label="Details" />
				</Col>

				<Col md="3">
					{projectDetails && projectDetails.campaignId && (
						<>
							<Tooltip placement="right" isOpen={toolTipOpen} toggle={toggleToolTip} target="viewCampaignFundraiser">
								{projectDetails.campaignTitle}
							</Tooltip>
							<button
								id="viewCampaignFundraiser"
								onClick={handleCampaignClick}
								type="button"
								className="btn waves-effect waves-light btn-outline-info"
								style={{ borderRadius: '8px', minWidth: '12px' }}
							>
								View Campaign
							</button>
						</>
					)}
				</Col>
			</Row>
			<Row>
				<Col md="7">
					{projectDetails && (
						<DetailsCard
							title="Project Details"
							button_name="Generate QR Code"
							name="Project Name"
							name_value={projectDetails.name}
							status={projectDetails.status}
							total="Project Budget"
							total_value={totalBudget.value}
							handleStatusChange={handleStatusChange}
						/>
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
