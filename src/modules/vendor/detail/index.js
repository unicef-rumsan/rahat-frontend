import React from 'react';
import { VendorContextProvider } from '../../../contexts/VendorContext';
import DetailPage from './DetailPage';

const index = props => {
	return (
		<VendorContextProvider>
			<DetailPage params={props.match.params} />
		</VendorContextProvider>
	);
};

export default index;
