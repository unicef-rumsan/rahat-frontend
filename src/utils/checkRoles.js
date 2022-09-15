import { getUser } from './sessionManager';
import { ROLES } from '../constants';

const { roles } = getUser();

export function isAdmin() {
	return roles.includes(ROLES.ADMIN);
}

export function isManager() {
	return roles.includes(ROLES.MANAGER);
}

export function isPalika() {
	return roles.includes(ROLES.PALIKA);
}

export function isAdminOrPalika() {
	return roles.includes(ROLES.PALIKA) || roles.includes(ROLES.PALIKA);
}
