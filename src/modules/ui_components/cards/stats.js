import React from 'react';
import { Card, CardTitle } from 'reactstrap';
import { formatBalanceAndCurrency } from '../../../utils';

import './cards.css';

export default function Stats(props) {
	const { title, title_color, subtitle, data, icon_name, icon_color } = props;
	return (
		<div>
			<Card>
				<div className="card-body">
					<CardTitle style={{ color: title_color || '#222', marginLeft: -4 }} className="title">
						<i style={{ color: icon_color || '#222', marginRight: 4 }} className={icon_name}></i> {title || 'No Title'}
					</CardTitle>
					<div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'right' }}>
						<h2 style={{ flexBasis: '100%' }} className="card-font-medium">
							{formatBalanceAndCurrency(data) || '0'}
						</h2>
					</div>
					<div style={{ marginTop: 0, textAlign: 'right' }} className="sub-title">
						{subtitle || ''}
					</div>
				</div>
				{/* <div className="earningsbox mt-1"></div> */}
			</Card>
		</div>
	);
}
