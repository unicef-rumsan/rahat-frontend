import React, { useCallback, useState, useContext, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { Card, CardBody, CardTitle, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import Swal from "sweetalert2";
import { TOAST } from '../../../constants';
import { getUser } from '../../../utils/sessionManager';
import { UserContext } from '../../../contexts/UserContext';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { History } from '../../../utils/History';
import WalletUnlock from '../../global/walletUnlock';
import GrowSpinner from '../../global/GrowSpinner';
import { ROLES } from '../../../constants'
import SelectWrapper from '../../global/SelectWrapper';
import { isAddress } from 'ethers/lib/utils';
import { createRandomIdentity } from '../../../utils';


const current_user = getUser();

const AddUser = () => {
	const { addToast } = useToasts();
	const { addUser } = useContext(UserContext);
	const { wallet, appSettings, isVerified, loading, setLoading, changeIsverified } = useContext(AppContext);

	const [passcodeModal, setPasscodeModal] = useState(false);

	const togglePasscodeModal = useCallback(() => {
		setPasscodeModal(!passcodeModal);
	}, [passcodeModal]);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		wallet_address: ''
	});
	const roles = Object.values(ROLES).map((el) => { return { label: el, value: el } })
	const confirmAndCreateWallet = async () => {
		const res = await Swal.fire({
			title: "Wallet Address not found",
			text: "Should We will create a wallet for you?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, proceed!",
		})
		if (res.isConfirmed) {
			const identity = createRandomIdentity();
			saveUserDetails(identity.address)
		}

	}
	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value, agency: current_user.agency });
	};

	const handleRoleChange = data => {
		const values = data.map(d => d.value);
		setFormData({ ...formData, roles: values })
	};

	const handleFormSubmit = e => {
		e.preventDefault();
		console.log(formData.wallet_address)
		if (!formData?.roles?.length) return addToast('Please select role', TOAST.ERROR);
		if (!current_user.agency) return addToast('Agency not found', TOAST.ERROR);
		if (!formData.wallet_address) return confirmAndCreateWallet()
		if (!isAddress(formData.wallet_address)) return addToast("Invalid Wallet Address", TOAST.ERROR)
		if (formData.wallet_address) return saveUserDetails()
		confirmAndCreateWallet();
		//saveUserDetails();
		return;
	};

	const handleCancelClick = () => History.push('/users');

	const saveUserDetails = (wallet_address) => {
		if (!wallet) return addToast('Wallet not found', TOAST.ERROR);
		setLoading(true);
		const { rahat, rahat_admin } = appSettings.agency.contracts;
		if (wallet_address) formData.wallet_address = wallet_address
		addUser({ payload: formData, rahat, rahat_admin, wallet })
			.then(() => {
				setLoading(false);
				History.push('/users');
				addToast('User added successfully', TOAST.SUCCESS);
			})
			.catch(err => {
				console.log(err)
				setLoading(false);
				addToast(err.message, TOAST.ERROR);
			});
	};

	return (
		<div>
			<WalletUnlock open={passcodeModal} onClose={e => setPasscodeModal(e)}></WalletUnlock>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<CardTitle className="mb-0">Add User</CardTitle>
						</CardBody>
						<CardBody>
							<Form onSubmit={handleFormSubmit}>
								<Row>
									<Col md="6">
										<FormGroup>
											<Label>Full Name</Label>
											<Input type="text" value={formData.name} name="name" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
									<Col md="6">
										<FormGroup>
											<Label>Email</Label>
											<Input type="email" value={formData.email} name="email" onChange={handleInputChange} required />
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md="6">
										<FormGroup>
											<Label>Phone</Label>
											<Input type="text" value={formData.phone} name="phone" onChange={handleInputChange} />
										</FormGroup>
									</Col>
									<Col md="6">
										<FormGroup>
											<Label>Wallet Address</Label>
											<Input
												type="text"
												value={formData.wallet_address}
												name="wallet_address"
												onChange={handleInputChange}
											/>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col md="6">
										<FormGroup>
											<Label>Role</Label>
											<SelectWrapper
												multi={true}
												onChange={handleRoleChange}
												maxMenuHeight={150}
												data={roles}
												placeholder="--Select Project--"
											/>
											{/* <Input type="select" name="roles" onChange={handleRoleChange}>
												<option value="">--Select Role--</option>
												<option value="Admin">Admin</option>
												<option value="Manager">Manager</option>
											</Input> */}
										</FormGroup>
									</Col>
									<Col md="6"></Col>
								</Row>
								<CardBody style={{ paddingLeft: 0 }}>
									{loading ? (
										<GrowSpinner />
									) : (
										<div>
											<Button type="submit" className="btn btn-info">
												<i className="fa fa-check"></i> Save
											</Button>
											<Button
												type="button"
												onClick={handleCancelClick}
												style={{ borderRadius: 8 }}
												className="btn btn-dark ml-2"
											>
												Cancel
											</Button>
										</div>
									)}
								</CardBody>
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default AddUser;
