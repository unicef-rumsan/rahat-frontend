import { ethers } from 'ethers';
import CONTRACT from '../constants/contracts';
import { getContractInstance, generateMultiCallData } from '../blockchain/abi';

const vendorRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('VENDOR'));

const TriggerResponseContract = (contractAddress, wallet) =>
	getContractInstance(contractAddress, CONTRACT.RAHAT_TRIGGER_RESPONSE, wallet);

const RahatContract = (contractAddress, wallet) => getContractInstance(contractAddress, CONTRACT.RAHAT, wallet);

export const BC = {
	async listTriggerAdmins({ contractAddress, wallet }) {
		const contract = await TriggerResponseContract(contractAddress, wallet);
		return contract.listAdmins();
	},

	async listTriggerConfirmations(projectId, { contractAddress, wallet }) {
		projectId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(projectId));
		const contract = await TriggerResponseContract(contractAddress, wallet);
		let admins = await contract.listAdmins();
		let adminConfirmations = [];
		for (let admin of admins) {
			adminConfirmations.push({
				name: 'Admin: ...' + admin.slice(-4),
				address: admin,
				isConfirmed: await contract.adminConfirmations(projectId, admin)
			});
		}
		return adminConfirmations;
	},

	async activateResponse(projectId, { contractAddress, wallet }) {
		const contract = await TriggerResponseContract(contractAddress, wallet);
		return contract.activateResponse(projectId);
	},

	async deactivateResponse(projectId, { contractAddress, wallet }) {
		const contract = await TriggerResponseContract(contractAddress, wallet);
		return contract.deactivateResponse(projectId);
	},

	async changeVendorStatus(vendorAddress, isActive, { contractAddress, wallet }) {
		const contract = await RahatContract(contractAddress, wallet);
		if (isActive) return contract.grantRole(vendorRole, vendorAddress);
		else return contract.revokeRole(vendorRole, vendorAddress);
	},

	async isVendor(vendorAddress, { contractAddress, wallet }) {
		const contract = await RahatContract(contractAddress, wallet);
		return contract.hasRole(vendorRole, vendorAddress);
	},

	async isProjectResponseLive({ contractAddress, wallet }) {
		const contract = await TriggerResponseContract(contractAddress, wallet);
		return contract.isLive();
	},

	async issueTokenToBeneficiary(projectId, phone, amount, { contractAddress, wallet }) {
		const contract = await RahatContract(contractAddress, wallet);
		await contract.issueERC20ToBeneficiary(projectId, phone, amount);
	}
};
