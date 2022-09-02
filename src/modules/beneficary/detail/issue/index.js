import React, { useContext } from 'react';
import { Card, Col, Row, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import '../../../../assets/css/project.css';
import BreadCrumb from '../../../ui_components/breadcrumb';
import TokenTab from './token/index';
import { AppContext } from '../../../../contexts/AppSettingsContext';

export default function BudgetAdd({ match }) {
	const { projectId, benfId } = match.params;

	return (
		<div>
			<p className="page-heading">Beneficiary</p>
			<BreadCrumb redirect_path={`beneficiaries/${benfId}`} root_label="Details" current_label="Issue" />
			<Card>
				<div className="stat-card-body">
					<TokenTab benfId={benfId} projectId={projectId} />
				</div>
			</Card>
		</div>
	);
}
