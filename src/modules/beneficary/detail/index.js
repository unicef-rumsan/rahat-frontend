import React from 'react';
import { BeneficiaryContextProvider } from '../../../contexts/BeneficiaryContext';
import DetailPage from './DetailPage';

const index = props => {
	return (
		<BeneficiaryContextProvider>
			<DetailPage params={props.match.params} />
		</BeneficiaryContextProvider>
	);
};

export default index;
