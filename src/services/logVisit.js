import axios from 'axios';
import API from '../constants/api';

import { getUserToken } from '../utils/sessionManager';
const access_token = getUserToken();

export async function LogVisit(page) {
	return axios.post(
		`${API.LOG}`,
		{ page },
		{
			headers: { access_token: access_token }
		}
	);
}
