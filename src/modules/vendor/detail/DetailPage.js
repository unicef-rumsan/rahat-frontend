import React, { useContext, useCallback, useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';

import { VendorContext } from '../../../contexts/VendorContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import BreadCrumb from '../../ui_components/breadcrumb';
import { TOAST } from '../../../constants';
import { VENDOR_STATUS } from '../../../constants';
import MaskLoader from '../../global/MaskLoader';
import { getBalance } from '../../../blockchain/abi';
import { BC } from '../../../services/ChainService';
import { getVendorBalance, addVendorToProject, changeVendorStatus } from '../../../services/vendor';
import useVendorCache from '../../../hooks/useVendorCache';

import ProjectSelector from '../../ui_components/projects/ProjectSelector';
import ActionMenu from './ActionMenu';
import VendorInfoCard from './VendorInfoCard';
import NameCard from './NameCard';
import TokenInfoCard from './TokenInfoCard';
import ProjectInvolved from '../../ui_components/projects';
import TransactionList from './TransactionList';

const Index = ({ params }) => {
	const { addToast } = useToasts();
	const { id } = params;
	const history = useHistory();

	const { getVendorDetails, getVendorTransactions } = useContext(VendorContext);
	const { wallet, appSettings } = useContext(AppContext);

	const [basicInfo, setBasicInfo] = useState({});
	const [loading, showLoading] = useState(false);
	const [vendorStatus, setVendorStatus] = useState('');

	const [showProjectSelector, setShowProjectSelector] = useState(false);
	const [projectSelectorContext, setProjectSelectorContext] = useState(null);
	const [selectedProject, setSelectedProject] = useState(null);

	const vendorBalance = useVendorCache(getVendorBalance, 'balance', { id, defaultValue: 0 });
	const ethBalance = useVendorCache(getBalance, 'ethBalance', { id, defaultValue: 0 });

	const handlers = {
		async approveVendor() {
			if (appSettings?.agency?.contracts?.rahat && wallet && basicInfo) {
				await addVendorToProject(id, selectedProject);
				await BC.changeVendorStatus(basicInfo.wallet_address, true, {
					contractAddress: appSettings.agency.contracts.rahat,
					wallet
				});
				await changeVendorStatus(id, VENDOR_STATUS.ACTIVE);
			}
		},

		async onProjectSelect(e) {
			e.preventDefault();
			try {
				showLoading(true);
				if (!selectedProject) throw new Error('Please select a project');
				if (projectSelectorContext === 'approve-vendor') {
					await handlers.approveVendor();
				}
				if (projectSelectorContext === 'add-project') {
					await addVendorToProject(id, selectedProject);
					addToast('Vendor added to the project', TOAST.SUCCESS);
				}
				await fetchVendorDetails();
			} catch (e) {
				addToast(e.message, TOAST.ERROR);
			} finally {
				setSelectedProject(null);
				setShowProjectSelector(false);
				showLoading(false);
			}
		}
	};

	const fetchVendorBalance = useCallback(
		async wallet_address => {
			if (appSettings.agency?.contracts?.rahat && wallet_address) {
				const { rahat_erc20 } = appSettings.agency.contracts;
				vendorBalance.request(rahat_erc20, wallet_address);
				ethBalance.request(wallet_address);
			}
		},
		[appSettings]
	);

	const fetchVendorStatus = useCallback(
		async details => {
			let isVendor = false;
			if (appSettings.agency?.contracts?.rahat && details.wallet_address) {
				isVendor = await BC.isVendor(details.wallet_address, {
					contractAddress: appSettings.agency.contracts.rahat
				});
				if (!details.projects.length) setVendorStatus(VENDOR_STATUS.NEW);
				else setVendorStatus(isVendor ? VENDOR_STATUS.ACTIVE : VENDOR_STATUS.SUSPENDED);
			}
		},
		[appSettings]
	);

	const fetchVendorDetails = useCallback(async () => {
		try {
			showLoading(true);
			const details = await getVendorDetails(id);
			if (!details) return;
			setBasicInfo(details);
			fetchVendorBalance(details.wallet_address);
			fetchVendorStatus(details);
		} catch (err) {
			addToast(err.message, TOAST.ERROR);
		} finally {
			showLoading(false);
		}
	}, [appSettings, id]);

	useEffect(() => {
		fetchVendorDetails();
	}, [fetchVendorDetails]);

	return (
		<>
			<MaskLoader message="Loading data from Blockchain, please wait..." isOpen={loading} />
			<ProjectSelector
				showProjectSelector={showProjectSelector}
				setShowProjectSelector={setShowProjectSelector}
				setSelectedProject={setSelectedProject}
				onProjectSelect={handlers.onProjectSelect}
			/>

			<Row>
				<Col md="8">
					<p className="page-heading">Vendors</p>
					<BreadCrumb redirect_path="vendors" root_label="Vendors" current_label="Details" />
				</Col>
				<Col md="4" className="text-right pt-4">
					{vendorStatus && (
						<ActionMenu
							vendorInfo={basicInfo}
							vendorStatus={vendorStatus}
							handleApproveVendor={() => {
								setProjectSelectorContext('approve-vendor');
								setShowProjectSelector(true);
							}}
							handleAddToProject={() => {
								setProjectSelectorContext('add-project');
								setShowProjectSelector(true);
							}}
							fetchVendorStatus={fetchVendorStatus}
						/>
					)}
				</Col>
			</Row>

			{basicInfo && basicInfo.projects && (
				<>
					<Row>
						<Col md="7">{basicInfo && <NameCard vendorInfo={basicInfo} status={vendorStatus} />}</Col>
						<Col md="5">
							<TokenInfoCard
								action=""
								title="Balance"
								button_name=""
								balance={vendorBalance.value}
								ethBalance={ethBalance.value}
							/>
						</Col>
					</Row>

					<VendorInfoCard information={basicInfo} etherBalance={ethBalance.value} />

					<ProjectInvolved
						projects={basicInfo.projects}
						handleAddBtnClick={() => {
							setProjectSelectorContext('add-project');
							setShowProjectSelector(true);
						}}
						showAddBtn={true}
					/>
					{basicInfo.wallet_address && <TransactionList address={basicInfo.wallet_address} />}
				</>
			)}
		</>
	);
};

export default Index;
