import axios from 'axios';
import { getUserToken } from '../utils/sessionManager';
import API from '../constants/api';

const access_token = getUserToken();

export async function getBeneficiariesGeo() {
	const { data } = await axios({
		url: API.STATS + `/beneficiaries/geo`,
		method: 'get',
		headers: { access_token }
	});
	return data;
}

export async function getBeneficiariesByWard() {
	const { data } = await axios({
		url: API.STATS + `/beneficiaries/ward`,
		method: 'get',
		headers: { access_token }
	});
	return data;
}

export async function getBeneficiariesByGender() {
	const { data } = await axios({
		url: API.STATS + `/beneficiaries/gender`,
		method: 'get',
		headers: { access_token }
	});
	return data;
}

export async function getBeneficiariesByPhone() {
	const { data } = await axios({
		url: API.STATS + `/beneficiaries/phone`,
		method: 'get',
		headers: { access_token }
	});
	return data;
}

export async function getBeneficiariesByBank() {
	const { data } = await axios({
		url: API.STATS + `/beneficiaries/bank`,
		method: 'get',
		headers: { access_token }
	});
	return data;
}

export async function getBeneficiariesSummary() {
	const { data } = await axios({
		url: API.STATS + `/beneficiaries/summary`,
		method: 'get',
		headers: { access_token }
	});
	return data;
}
