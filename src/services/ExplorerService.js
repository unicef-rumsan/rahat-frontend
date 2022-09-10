import { ethers } from 'ethers';
import axios from 'axios';
import CONTRACT from '../constants/contracts';
import { getContractInstance } from '../blockchain/abi';

const EXPLORER_URL = process.env.REACT_APP_BLOCKCHAIN_EXPLORER;
const keccak256 = txt => ethers.utils.keccak256(ethers.utils.toUtf8Bytes(txt));

const RahatContract = (contractAddress, wallet) => getContractInstance(contractAddress, CONTRACT.RAHAT, wallet);

export async function listTransactionsByAddress(address) {
	return axios({
		url: `${EXPLORER_URL}/api?module=account&action=txlist&address=${address}`,
		method: 'GET'
	});
}
