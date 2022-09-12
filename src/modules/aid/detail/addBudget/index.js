import React, { useState } from 'react';
import { Card, Col, Row, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';

import '../../../../assets/css/project.css';

import BreadCrumb from '../../../ui_components/breadcrumb';
import TokenTab from './token/index';
//import Donation from './donation';

export default function BudgetAdd({ match }) {
	const { projectId } = match.params;

	return (
		<div>
			<p className="page-heading">Project</p>
			<BreadCrumb redirect_path={`projects/${projectId}`} root_label="Details" current_label="Add Budget" />
			<Card>
				<div className="stat-card-body">
					<TokenTab projectId={projectId} />
				</div>
			</Card>
			{/* <Donation projectId={projectId} /> */}
		</div>
	);
}
