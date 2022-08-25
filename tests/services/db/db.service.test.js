import DataService from '../../../src/services/db';
import 'fake-indexeddb/auto';
import 'regenerator-runtime/runtime';
import { NETWORKS, getNetworkByName } from '../../../src/constants/networks';
describe('Testing Index DB', () => {
	//Data Table
	describe('Tests major function in indx db data table', () => {
		it('gets network by name', async () => {
			const fetchNetwork = getNetworkByName('mainnet');

			expect(fetchNetwork).toMatchObject(NETWORKS.find(network => network.name === 'mainnet'));
		});
		it('Saves and gets data correctly', async () => {
			const name = 'Test Data';
			const data = {
				0: 'abx',
				1: 'qwery'
			};
			await DataService.save(name, data);
			const savedData = await DataService.get(name);

			expect(savedData).toMatchObject(data);
		});
		it('gets init app', async () => {
			const data = {
				network: {
					name: 'rumsan_test',
					url: 'http://195.179.200.228:8548',
					display: 'Rumsan Test Network',
					default: true
				},
				address: null,
				wallet: null
			};
			const initApp = await DataService.initAppData();
			expect(initApp).toMatchObject({ ...data });
		});
		it('gets removes data properly', async () => {
			const mockData = {
				name: 'testData',
				data: 'Hello world'
			};
			await DataService.save(mockData.name, mockData.data);

			const saveData = await DataService.get(mockData.name);
			expect(saveData).toBe(mockData.data);

			await DataService.remove(mockData.name);

			const removedData = await DataService.get(mockData.name);

			expect(removedData).toBeNull();
		});

		it('lists data table properly', async () => {
			const mockData = {
				name: 'Test Data',
				data: {
					0: 'abx',
					1: 'qwery'
				}
			};
			const list = await DataService.list();
			expect(list).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: mockData.name
					})
				])
			);
		});

		it('saves and gets network properly', async () => {
			// await DataService.clearAll();
			const network = NETWORKS.filter(netwrk => netwrk.name === 'rumsan');
			await DataService.saveNetwork(network);

			const savedNetwork = await DataService.getNetwork();
			expect(savedNetwork).toMatchObject(network);
		});
		it('saves and gets ipfsUrl properly', async () => {
			const mockUrl = process.env.REACT_APP_DEFAULT_IPFS;
			const mockDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
			await DataService.saveIpfsUrl(mockUrl);

			const saveUrl = await DataService.getIpfs();
			expect(saveUrl).toMatchObject({ ipfsUrl: mockUrl, ipfsDownloadUrl: mockDownloadUrl });
		});

		it('saves and gets ipfsUrl incorrectly', async () => {
			const mockUrl = 'http://ipfsUrl.com';
			const mockDownloadUrl = 'http://ipfsDownload.com';
			await DataService.saveIpfsUrl(mockUrl);
			await DataService.saveIpfsDownloadUrl(mockDownloadUrl);

			const saveUrl = await DataService.getIpfs();
			expect(saveUrl).toMatchObject({
				ipfsUrl: process.env.REACT_APP_DEFAULT_IPFS,
				ipfsDownloadUrl: process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD
			});
		});

		it('saves and gets ipfsDownloadUrl properly', async () => {
			const mockDownloadUrl = process.env.REACT_APP_DEFAULT_IPFS_DOWNLOAD;
			await DataService.saveIpfsDownloadUrl(mockDownloadUrl);

			const savedUrl = await DataService.get('ipfsUrlDownload');
			expect(savedUrl).toEqual(mockDownloadUrl);
		});

		it('saves private key', async () => {
			const mockPrivateKey = process.env.REACT_APP_PRIVATE_KEY;
			await DataService.savePrivateKey(mockPrivateKey);

			const SavePrivateKey = await DataService.get('privateKey');
			expect(SavePrivateKey).toEqual(mockPrivateKey);
		});

		it('saves and gets address properly', async () => {
			const mockAddress = 'banepa123';
			await DataService.saveAddress(mockAddress);

			const savedAddress = await DataService.getAddress();
			expect(savedAddress).toEqual(mockAddress);

			const locallySavedAddress = DataService.getAddressFromLocal();
			expect(locallySavedAddress).toEqual(mockAddress);
		});

		it('saves wallet properly', async () => {
			const mockWallet = {
				address: '0xeddA7538FB64f60589605AFeFC90c510d2cAfA18',
				network: 'https://testnetwork.esatya.io'
			};

			await DataService.saveWallet(mockWallet);

			const savedWallet = await DataService.getWallet();
			expect(savedWallet).toMatchObject(mockWallet);
		});
	});
});
