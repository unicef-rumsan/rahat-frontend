import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import indexRoutes from '../routes';
import { Router, Route, Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import { History } from '../utils/History';
import { PrivateRoute } from '../routes/PrivateRoutes';
import { AppContextProvider } from '../contexts/AppSettingsContext';
import { UserContextProvider } from '../contexts/UserContext';
import { AidContextProvider } from '../contexts/AidContext';
import { BeneficiaryContextProvider } from '../contexts/BeneficiaryContext';
import { MobilizerContextProvider } from '../contexts/MobilizerContext';

import AgencyRegistration from '../modules/agency/register';
import AuthWallet from '../modules/authentication/Wallet';
import PassportControl from '../modules/passport';
import SignUp from '../modules/authentication/SignUp';
import Approval from '../modules/authentication/Approval';
import { VendorContextProvider } from '../contexts/VendorContext';

const TRACKING_ID = process.env.REACT_APP_TRACKING_ID;

ReactGA.initialize(TRACKING_ID);

const App = () => {
	useEffect(() => {
		if (TRACKING_ID) {
			console.log('GAnalytics is enabled...');
			ReactGA.pageview(window.location.pathname + window.location.search);
		}
	}, [TRACKING_ID]);
	return (
		<AppContextProvider>
			<ToastProvider>
				<AidContextProvider>
					<BeneficiaryContextProvider>
						<VendorContextProvider>
							<MobilizerContextProvider>
								<UserContextProvider>
									<Router history={History}>
										<Switch>
											<Route exact path="/auth/wallet" component={AuthWallet} />
											<Route exact path="/sign_up" component={SignUp} />
											<Route exact path="/approval" component={Approval} />
											<Route path="/passport-control" component={PassportControl} />
											<Route path="/setup" component={AgencyRegistration} />
											{indexRoutes.map((prop, key) => {
												return <PrivateRoute path={prop.path} key={key} component={prop.component} />;
											})}
										</Switch>
									</Router>
								</UserContextProvider>
							</MobilizerContextProvider>
						</VendorContextProvider>
					</BeneficiaryContextProvider>
				</AidContextProvider>
			</ToastProvider>
		</AppContextProvider>
	);
};
export default App;
