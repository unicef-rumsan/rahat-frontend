import React from 'react';
import { Card, CardTitle, Col, Row, Label, Input, FormGroup } from 'reactstrap';

import '../../../assets/css/project.css';
import IdImgPlaceholder from '../../../assets/images/id-icon-1.png';
import { formatWord } from '../../../utils';
import moment from 'moment';

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY;

export default function BeneficiaryInfo({ basicInfo, extras }) {
	return (
		<div>
			<Card>
				<div className="stat-card-body" style={{ minHeight: 120 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CardTitle className="title" style={{ flexBasis: '90%' }}>
							More Information
						</CardTitle>
					</div>
					<Row>
						<Col md="6" sm="6" lg="4" xs="6">
							<div className="card-data">
								<p className="card-font-medium">{basicInfo.address || '-'}</p>
								<div className="sub-title">Address</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{basicInfo.phone || '-'}</p>
								<div className="sub-title">Phone</div>
							</div>
								<div className="card-data">
								<p className="card-font-medium">{extras && extras.age ? extras.age : '-'}</p>
								<div className="sub-title">Age</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{basicInfo.govt_id || '-'}</p>
								<div className="sub-title">Government ID Type</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.education ? extras.education : '-'}</p>
								<div className="sub-title">Education</div>
							</div>
							
							{/* <div className="card-data">
								<p className="card-font-medium">{extras && extras.group ? formatWord(extras.group) : '-'}</p>
								<div className="sub-title">Group</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.adult ? extras.adult : '-'}</p>
								<div className="sub-title">Number of family member (Adult)</div>
							</div> */}
						</Col>
						<Col md="6" sm="6" lg="4" xs="6">
							<div className="card-data">
								<p className="card-font-medium">10</p>
								<div className="sub-title">Ward</div>
							</div>
								<div className="card-data">
								<p className="card-font-medium">test@rumsan.com</p>
								<div className="sub-title">Email</div>
							</div>
								<div className="card-data">
								<p className="card-font-medium">40+</p>
								<div className="sub-title">Category</div>
							</div>	<div className="card-data">
								<p className="card-font-medium">-</p>
								<div className="sub-title">Government ID</div>
							</div>
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.profession ? extras.profession : '-'}</p>
								<div className="sub-title">Profession</div>
							</div>

							{/* <div className="card-data">
								<p className="card-font-medium">{basicInfo.gender || '-'}</p>
								<div className="sub-title">Gender</div>
							</div>
						
							<div className="card-data">
								<p className="card-font-medium">{extras && extras.child ? extras.child : '-'}</p>
								<div className="sub-title">Number of family member(Child)</div>
							</div> */}
						</Col>
						<Col md="3" sm="12" lg="4" xs="12">
							{/* <img
								src={basicInfo.govt_id_image ? `${IPFS_GATEWAY}/ipfs/${basicInfo.govt_id_image}` : IdImgPlaceholder}
								alt="certificate"
								width="90%"
								height="60%"
								className="card-data"
							/> */}
							<div>
								<Col>	
						<CardTitle className="title"  style={{ marginLeft:"-16px" ,  whiteSpace:"nowrap" }}>
							Category of Household :
						</CardTitle>
								</Col>			
						<FormGroup check>
       					   <Label check>
        				    <Input style={{marginTop:"7px"}} type="checkbox" />
          					<p style={{whiteSpace:"nowrap" , fontWeight:"500"}}>Family depends on daily wages</p> 
          				   </Label>
								</FormGroup>
								<FormGroup check>
       					   <Label check>
        				    <Input style={{marginTop:"7px"}} type="checkbox" />
          					  <p style={{whiteSpace:"nowrap" , fontWeight:"500"}}>Family does not own any land</p>
          				   </Label>
								</FormGroup>
								<FormGroup check>
       					   <Label check>
        				    <Input style={{marginTop:"7px"}} type="checkbox" />
          					<p style={{whiteSpace:"nowrap" , fontWeight:"500"}}>Family has person with disability</p>
          				   </Label>
      					</FormGroup>
							</div>
						
							<div className="card-data mt-5">
								<p className="card-font-medium">{moment(extras.created_at).format('MMM Do YYYY, hh:mm A') || '-'}</p>
								<div className="sub-title">Registration Date</div>
							</div>
						</Col>
						
					</Row>
					<Row>
						<Col><div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CardTitle className="title mt-3"  style={{ flexBasis: '90%' }}>
							Bank Details
						</CardTitle>
						</div>
						</Col>						
					</Row>
					<Row>
						<Col>
								<div className="card-data">
								<p className="card-font-medium">-</p>
								<div className="sub-title">Bank</div>
				</div>
						</Col>
						<Col>
								<div className="card-data">
								<p className="card-font-medium">-</p>
								<div className="sub-title">Bank Account Name</div>
				</div>
						</Col>
					</Row>
					<Row>
						<Col>
								<div className="card-data">
								<p className="card-font-medium">-</p>
								<div className="sub-title">Swift Code</div>
				</div>
						</Col>
						<Col>
								<div className="card-data">
								<p className="card-font-medium">-</p>
								<div className="sub-title">Bank Account Number</div>
				</div>
						</Col>
					</Row>
					
				</div>
			</Card>
		</div>
	);
}
