import { ethers } from 'ethers';
import CONTRACT from '../../constants/contracts';
import { getContractInstance, generateMultiCallData } from '../../blockchain/abi';

const vendorRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('VENDOR'));

export const VCS = {
	async changeVendorStatus(vendorAddress, isActive, { contractAddress, wallet }) {
		const contract = await getContractInstance(contractAddress, CONTRACT.RAHAT, wallet);
		if (isActive) return contract.grantRole(vendorRole, vendorAddress);
		else return contract.revokeRole(vendorRole, vendorAddress);
	},

	async isVendor(vendorAddress, { contractAddress, wallet }) {
		const contract = await getContractInstance(contractAddress, CONTRACT.RAHAT, wallet);
		return contract.hasRole(vendorRole, vendorAddress);
	}
};
