import Dexie from 'dexie';

import { DB } from '../constants/db';
import { getDefaultNetwork } from '../constants/networks';

const db = new Dexie(DB.NAME);
db.version(DB.VERSION).stores({
	data: 'name,data',
	documents: 'hash,type,name,file,createdAt',
	assets: 'address,type,name,symbol,decimal,balance,network',
	projects: 'id, data',
	beneficiaries: 'id, data',
	vendors: 'id, data'
});

export default {
	save(name, data) {
		return db.data.put({ name, data });
	},

	async get(name) {
		let obj = await db.data.get(name);
		if (!obj) return null;
		return obj.data;
	},

	remove(name) {
		return db.data.delete(name);
	},

	list() {
		return db.data.toArray();
	},

	async initAppData() {
		let network = await this.getNetwork();
		let address = await this.getAddress();
		let wallet = await this.getWallet();
		return { network, address, wallet };
	},

	async clearAll() {
		await db.data.clear();
		await db.assets.clear();
		await db.documents.clear();
	},

	saveNetwork(network) {
		return this.save('network', network);
	},

	async getNetwork() {
		let network = await this.get('network');
		if (!network) return getDefaultNetwork();
		return network;
	},

	async getIpfs() {
		let ipfsUrl = await this.get('ipfsUrl');
		if (!ipfsUrl) ipfsUrl = process.env.REACT_APP_DEFAULT_IPFS;
		let ipfsDownloadUrl = await this.get('ipfsUrlDownload');
		if (!ipfsDownloadUrl) ipfsDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
		return { ipfsUrl, ipfsDownloadUrl };
	},

	saveIpfsUrl(ipfsUrl) {
		return this.save('ipfsUrl', ipfsUrl);
	},

	saveIpfsDownloadUrl(ipfsDownloadUrl) {
		return this.save('ipfsUrlDownload', ipfsDownloadUrl);
	},

	saveAddress(address) {
		return this.save('address', address);
	},

	savePrivateKey(privateKey) {
		return this.save('privateKey', privateKey);
	},

	getAddress() {
		return this.get('address');
	},

	async saveWallet(wallet) {
		return this.save('wallet', wallet);
	},

	getWallet() {
		return this.get('wallet');
	},

	async saveProject(id, data) {
		let cacheData = await db.projects.get(id);
		if (!cacheData) {
			data = data || {};
			return db.projects.put({ id, ...data });
		}
		data = Object.assign(cacheData, data);
		return db.projects.update(id, data);
	},

	async getProject(id, field) {
		let cacheData = await db.projects.get(id);
		if (field) return cacheData?.[field];
		return cacheData;
	},

	async listProjects() {
		return db.projects.toArray();
	},

	async saveBeneficiary(id, data) {
		let cacheData = await db.beneficiaries.get(id);
		if (!cacheData) {
			data = data || {};
			return db.beneficiaries.put({ id, ...data });
		}
		data = Object.assign(cacheData, data);
		return db.beneficiaries.update(id, data);
	},

	async getBeneficiary(id, field) {
		let cacheData = await db.beneficiaries.get(id);
		if (field) return cacheData?.[field];
		return cacheData;
	},

	async listBeneficiaries() {
		return db.beneficiaries.toArray();
	},

	async saveVendor(id, data) {
		let cacheData = await db.vendors.get(id);
		if (!cacheData) {
			data = data || {};
			return db.vendors.put({ id, ...data });
		}
		data = Object.assign(cacheData, data);
		return db.vendors.update(id, data);
	},

	async getVendor(id, field) {
		let cacheData = await db.vendors.get(id);
		if (field) return cacheData?.[field];
		return cacheData;
	},

	async listVendors() {
		return db.vendors.toArray();
	}
};
