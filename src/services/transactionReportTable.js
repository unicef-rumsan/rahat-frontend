import axios from 'axios';
import { TRANSACTION_TABLE_REPORT } from '../constants/api';

export const getTableData = async payload => {
	try {
		const response = await axios.get(TRANSACTION_TABLE_REPORT);
		return response.data;
	} catch (error) {
		console.log('error', error);
	}
};
