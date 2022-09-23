import { ethers, utils } from 'ethers';
import axios from 'axios';
import CONTRACT from '../constants/contracts';
import { getAbi } from '../blockchain/abi';

const EXPLORER_URL = process.env.REACT_APP_BLOCKCHAIN_EXPLORER;
const keccak256 = txt => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(txt));

const _listClaimLogs = async params => {
	let { data } = await axios.get(`${EXPLORER_URL}/api`, {
		params
	});
	const iface = new ethers.utils.Interface(getAbi('Rahat'));
	return data.result.map(d => {
		const topics = d.topics.filter(d => d !== null);
		let log = iface.parseLog({
			data: d.data,
			topics
		});

		const { blockNumber, timeStamp, transactionHash } = d;
		const { vendor, beneficiary, amount } = log.args;

		return {
			timeStamp: Number(timeStamp),
			transactionHash,
			blockNumber,
			vendor,
			beneficiary: beneficiary.toNumber(),
			amount: amount.toNumber()
		};
	});
};

export async function listTransactionsByAddress(address) {
	return axios({
		url: `${EXPLORER_URL}/api?module=account&action=txlist&address=${address}`,
		method: 'GET'
	});
}

export async function listBeneficiaryTxs(contractAddress, phone) {
	return _listClaimLogs({
		module: 'logs',
		action: 'getLogs',
		fromBlock: 16112707,
		toBlock: 'latest',
		address: contractAddress,
		topic0: utils.id('ClaimAcquiredERC20(address,uint256,uint256)'),
		topic2: ethers.utils.defaultAbiCoder.encode(['uint256'], [phone]),
		topic0_2_opr: 'and'
	});
}

export async function listVendorTxs(contractAddress, vendorAddress) {
	return _listClaimLogs({
		module: 'logs',
		action: 'getLogs',
		fromBlock: 16112707,
		toBlock: 'latest',
		address: contractAddress,
		topic0: utils.id('ClaimAcquiredERC20(address,uint256,uint256)'),
		topic1: ethers.utils.defaultAbiCoder.encode(['address'], [vendorAddress]),
		topic0_1_opr: 'and'
	});
}
