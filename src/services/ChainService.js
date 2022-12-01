import { ethers } from 'ethers';
import CONTRACT from '../constants/contracts';
import { getContractInstance, generateMultiCallData } from '../blockchain/abi';
import { getEth } from './vendor';

const keccak256 = txt => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(txt));
const vendorRole = keccak256('VENDOR');

const TriggerResponseContract = (contractAddress, wallet) =>
	getContractInstance(contractAddress, CONTRACT.RAHAT_TRIGGER_RESPONSE, wallet);

const RahatContract = (contractAddress, wallet) => getContractInstance(contractAddress, CONTRACT.RAHAT, wallet);

export const BC = {
	async sendEth(to, amount, { wallet }) {
		const tx = {
			from: wallet.address,
			to,
			value: ethers.utils.parseEther(amount.toString()),
			nonce: wallet.getTransactionCount('latest'),
			gasLimit: ethers.utils.hexlify(100000), // 100000
			gasPrice: wallet.getGasPrice()
		};
		return wallet.sendTransaction(tx);
	},

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
		if (isActive) {
			//getEth({ address: vendorAddress });
			return contract.addVendor(vendorAddress);
		} else return contract.revokeRole(vendorRole, vendorAddress);
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
	},

	async suspendBeneficiary(phone, projectId, { contractAddress, wallet }) {
		const contract = await RahatContract(contractAddress, wallet);
		return contract.suspendBeneficiary(phone, keccak256(projectId));
	}
};
