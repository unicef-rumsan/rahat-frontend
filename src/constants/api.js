const SERVER_URL = process.env.REACT_APP_API_SERVER;
const FUNDRAISER_SERVER_URL = process.env.REACT_APP_API_FUNDRAISER;
const FUNDRAISER_URL = process.env.REACT_APP_API_FUNDRAISER_SERVER;
const API_PATH = SERVER_URL + '/api/v1';

const REACT_APP_TRANSACTION_REPORT_SERVER = process.env.REACT_APP_TRANSACTION_REPORT_SERVER || 'http://localhost:4900';

module.exports = {
	REACT_APP_TRANSACTION_REPORT_SERVER: REACT_APP_TRANSACTION_REPORT_SERVER.replace('http', 'ws'),
	FUNDRAISER_CAMPAIGN: FUNDRAISER_SERVER_URL + '/api/campaign',
	FUNDRAISER_FUNDRAISE: FUNDRAISER_URL + '/fundraise',
	FUNDRAISER_DONATION: FUNDRAISER_SERVER_URL + '/api/donation',
	AGENCY: API_PATH + '/agency',
	SETTINGS: API_PATH + '/app/settings',
	APP: API_PATH + '/app',
	AID_CONNECT: API_PATH + '/aid-connect',
	BENEFICARIES: API_PATH + '/beneficiaries',
	INSTITUTIONS: API_PATH + '/institutions',
	METAMASK_LOGIN: API_PATH + '/auth/wallet',
	ONBOARD: API_PATH + '/onboard',
	PROJECTS: API_PATH + '/projects',
	REGISTER: API_PATH + '/agency/register',
	TOKEN_AUTH: API_PATH + '/auth',
	USERS: API_PATH + '/users',
	VENDORS: API_PATH + '/vendors',
	FAUCET: process.env.REACT_APP_BLOCKCHAIN_FAUCET,
	MOBILIZERS: API_PATH + '/mobilizers',
	NFT: API_PATH + '/nft',
	Notification: API_PATH + '/notifications',
	Sms: API_PATH + '/sms',
	CheckUserExistsURL: FUNDRAISER_SERVER_URL + '/api/user/checkUserExists',
	CreateUserFundraiserURL: FUNDRAISER_SERVER_URL + '/api/user/register',
	TRANSACTION_TABLE_REPORT: REACT_APP_TRANSACTION_REPORT_SERVER + '/api/v1/transactions'
};
