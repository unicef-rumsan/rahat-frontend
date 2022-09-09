import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Row, Col, FormGroup, InputGroup, Input } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import QRCode from 'qrcode';

import ProjectInvovled from '../../ui_components/projects';
import BreadCrumb from '../../ui_components/breadcrumb';
import ModalWrapper from '../../global/CustomModal';
import { TOAST } from '../../../constants';

import { AppContext } from '../../../contexts/AppSettingsContext';
import { BeneficiaryContext } from '../../../contexts/BeneficiaryContext';
import { htmlResponse } from '../../../utils/printSingleBeneficiary';
import { useHistory } from 'react-router-dom';

import * as Service from '../../../services/beneficiary';
import useBeneficiaryCache from '../../../hooks/useBeneficiaryCache';

import BeneficiaryInfo from './BeneficiaryInfo';
import ProjectSelector from './ProjectSelector';
import BeneficiaryActions from './ActionMenu';
import NameCard from './NameCard';
import TokenInfoCard from './TokenInfoCard';

const BenefDetails = ({ params }) => {
	const { id } = params;
	const { addToast } = useToasts();
	const history = useHistory();

	const { getBeneficiaryDetails, listProject, addBenfToProject } = useContext(BeneficiaryContext);
	const { loading, appSettings } = useContext(AppContext);

	const [basicInfo, setBasicInfo] = useState({});
	const [extras, setExtras] = useState({});
	const [benProjectList, setBenProjectList] = useState([]);
	const [assignTokenAmount, setAssignTokenAmount] = useState('');

	const [assignTokenModal, setAssignTokenModal] = useState(false);

	const [showProjectSelector, setShowProjectSelector] = useState(false);
	const [projectSelectorContext, setProjectSelectorContext] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);

	const beneficiaryBalance = useBeneficiaryCache(Service.getBeneficiaryBalance, 'balance', {
		id,
		callback: balance => {
			setBasicInfo(basicInfo => Object.assign(basicInfo, { balance }));
		}
	});
	const beneficiaryTotalIssued = useBeneficiaryCache(Service.getTotalIssuedTokens, 'totalIssued', {
		id
	});

	//#region Bulk Assignment and QR Code print
	const toggleAssignTokenModal = () => setAssignTokenModal(!assignTokenModal);
	const handleAssignTokenChange = e => setAssignTokenAmount(e.target.value);
	const handleTokenInputSubmit = e => {
		e.preventDefault();
		const { name, address, govt_id, phone } = basicInfo;
		const payload = { name, address, govt_id, phone };
		generateQrAndPrint(payload);
	};

	const generateQrAndPrint = async payload => {
		toggleAssignTokenModal();
		const imgUrl = await QRCode.toDataURL(`phone:+977${payload.phone}?amount=${assignTokenAmount || null}`);
		const html = await htmlResponse(payload, imgUrl);
		setAssignTokenAmount('');
		let newWindow = window.open('', 'Print QR', 'fullscreen=yes'),
			document = newWindow.document.open();
		console.log({ newWindow });
		document.write(html);
		document.close();
		setTimeout(function () {
			newWindow.print();
			newWindow.close();
		}, 250);
	};
	//#endregion

	//#region Project Handlers

	const onProjectSelect = async e => {
		e.preventDefault();
		if (!selectedProject) return addToast('Please select project', TOAST.ERROR);
		if (projectSelectorContext === 'issue-token') {
			history.push(`/issue-budget/${selectedProject}/benf/${id}`);
		}
		if (projectSelectorContext === 'add-project') {
			try {
				await addBenfToProject(id, selectedProject);
				addToast('Beneficiary has been added to the project', TOAST.SUCCESS);
				fetchBeneficiaryDetails();
			} catch (err) {
				const errMsg = err.message ? err.message : 'Internal server error';
				addToast(errMsg, TOAST.ERROR);
			}
		}
		setSelectedProject(null);
		setShowProjectSelector(false);
	};

	const handleProjectSwitch = () => {
		if (basicInfo.balance > 0) {
			return addToast(
				'Cannot switch project when beneficiary has a balance from current project. Please suspend beneficiary -> change project -> Issue new project tokens',
				TOAST.ERROR
			);
		}
		setProjectSelectorContext('add-project');
		setShowProjectSelector(true);
	};

	//#endregion

	//#region UseEffects
	const fetchBeneficiaryDetails = useCallback(async () => {
		const { agency } = appSettings;
		if (!agency || !agency.contracts) return;
		const details = await getBeneficiaryDetails(id);
		if (details && details.extras) setExtras(details.extras);
		if (details.projects && details.projects.length) {
			const projects = details.projects.map(d => {
				return { id: d._id, name: d.name };
			});
			setBenProjectList(projects);
			//ToDo - Temporary, need to change
			details.currentProject = projects[0];
		}
		setBasicInfo(details);
		beneficiaryBalance.request(details.phone, agency.contracts.rahat);
		beneficiaryTotalIssued.request(details.phone, agency.contracts.rahat);
	}, [appSettings, getBeneficiaryDetails, id]);

	useEffect(() => {
		fetchBeneficiaryDetails();
	}, [fetchBeneficiaryDetails]);
	//#endregion

	return (
		<>
			<ProjectSelector
				showProjectSelector={showProjectSelector}
				setShowProjectSelector={setShowProjectSelector}
				setSelectedProject={setSelectedProject}
				onProjectSelect={onProjectSelect}
			/>

			{/* Assign token modal */}
			<ModalWrapper
				title="Set Tokens"
				open={assignTokenModal}
				toggle={toggleAssignTokenModal}
				handleSubmit={handleTokenInputSubmit}
			>
				<FormGroup>
					<InputGroup>
						<Input
							type="number"
							name="assignTokenAmount"
							placeholder="Enter number of tokens (optional)"
							value={assignTokenAmount}
							onChange={handleAssignTokenChange}
						/>
					</InputGroup>
				</FormGroup>
			</ModalWrapper>

			<Row>
				<Col md="8">
					<p className="page-heading">Beneficiary</p>
					<BreadCrumb redirect_path="beneficiaries" root_label="Beneficiary" current_label="Details" />
				</Col>
				<Col md="4" className="text-right pt-4">
					<BeneficiaryActions
						benInfo={basicInfo}
						handleAddToProject={handleProjectSwitch}
						refreshBeneficiaryData={fetchBeneficiaryDetails}
						handleIssueToken={() => {
							if (!basicInfo.currentProject)
								return addToast('Beneficiary is not part of any project. Please add to project first.', TOAST.ERROR);
							history.push(`/issue-budget/${basicInfo.currentProject.id}/benf/${id}`);
						}}
					/>
				</Col>
			</Row>
			<Row>
				<Col md="7">
					<NameCard benInfo={basicInfo} isActive={beneficiaryBalance.value} />
				</Col>
				<Col md="5">
					<TokenInfoCard
						action="issue_token"
						title="Current Balance"
						button_name="Issue New Tokens"
						balance={beneficiaryBalance.value}
						totalIssued={beneficiaryTotalIssued.value}
						handleIssueToken={() => {
							if (!basicInfo.currentProject)
								return addToast('Beneficiary is not part of any project. Please add to project first.', TOAST.ERROR);
							history.push(`/issue-budget/${basicInfo.currentProject.id}/benf/${id}`);
						}}
					/>
				</Col>
			</Row>

			{basicInfo && <BeneficiaryInfo basicInfo={basicInfo} extras={extras} />}

			<ProjectInvovled handleAddBtnClick={handleProjectSwitch} showAddBtn={true} projects={benProjectList} />
		</>
	);
};

export default BenefDetails;
