import { listAid } from '../services/aid';

export const getProjectFromLS = () => {
	return localStorage.getItem('currentProject');
};

export const setProjectToLS = value => {
	localStorage.setItem('currentProject', value);
};

export async function getActiveProject() {
	const { data } = await listAid();
	return data[0]?._id;
}
