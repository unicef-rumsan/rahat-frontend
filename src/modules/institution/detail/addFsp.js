import React, { useState, useContext } from 'react';
import { Card, CardBody, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { AppContext } from '../../../contexts/AppSettingsContext';
import { History } from '../../../utils/History';
import FspSelector from '../../global/FspSelector';
import GrowSpinner from '../../../modules/global/GrowSpinner';
import { addFsp } from '../../../services/fsp';
import { getProjectFromLS } from '../../../utils/checkProject';

const AddFsp = params => {
	const { loading } = useContext(AppContext);
	const [selectorFsp] = useState('');
	const { addToast } = useToasts();
	const [formData, setFormData] = useState({
		name: '',
		account_number: '',
		bisCode: '',
		email: '',
		phone: '',
		address: ''
	});
	const handleInputChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleFormSubmit = async e => {
		e.preventDefault();
		const projectId = getProjectFromLS();
		formData.project = projectId;
		try {
			const response = await addFsp(projectId, formData);
			if (response.status === 200) {
				addToast('Fsp Added Successfully', { appearance: 'success', autoDismiss: true });
				History.push('/projects/current');
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleCancelClick = () => History.push('/projects/current');
	const matchFsp = data => {
		const { name, bisCode, address, email, phone, account_number } = data;
		const bankValue = {
			name,
			account_number,
			bisCode: bisCode,
			email: email,
			address,
			phone: phone
		};
		setFormData(bankValue);
	};
	return (
		<div>
			<Row>
				<Col md="12">
					<Card>
						<CardBody>
							<p className="page-heading mb-5">Add New FSP</p>
							<Form onSubmit={handleFormSubmit}>
								<Row>
									<Col lg={4} md={12}>
										<FormGroup>
											<Label>Bank Name`</Label>
											<FspSelector
												fsp={selectorFsp}
												onChange={e => {
													matchFsp(e);
												}}
												label={false}
											/>
										</FormGroup>
									</Col>
									<Col lg={4} md={12}>
										<FormGroup>
											<Label>Swift Code</Label>
											<Input
												readOnly
												type="text"
												name="bisCode"
												onChange={handleInputChange}
												defaultValue={formData.bisCode}
												required
											/>
										</FormGroup>
									</Col>
									<Col lg={4} md={12}>
										<FormGroup>
											<Label>
												Bank Account Number <span className="text-danger">*</span>
											</Label>
											<Input
												type="text"
												name="account_number"
												onChange={handleInputChange}
												defaultValue={formData.account_number}
												required
											/>
										</FormGroup>
									</Col>
								</Row>
								<Row>
									<Col lg={4} md={12}>
										<FormGroup>
											<Label>
												Contact Name<span className="text-danger">*</span>
											</Label>
											<Input name="contact_name" type="text" required />
										</FormGroup>
									</Col>
									<Col lg={4} md={12}>
										<FormGroup>
											<Label>
												Contact Email<span className="text-danger">*</span>
											</Label>
											<Input
												name="email"
												onChange={handleInputChange}
												defaultValue={formData.email}
												type="text"
												required
											/>
										</FormGroup>
									</Col>
									<Col lg={4} md={12}>
										<FormGroup>
											<Label>
												Contact Phone<span className="text-danger">*</span>
											</Label>
											<Input
												name="phone"
												onChange={handleInputChange}
												defaultValue={formData.phone}
												type="text"
												required
											/>
										</FormGroup>
									</Col>
								</Row>

								{loading ? (
									<GrowSpinner />
								) : (
									<div>
										<Button type="submit" className="btn btn-info">
											<i className="fa fa-check"></i> Submit
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
							</Form>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default AddFsp;
