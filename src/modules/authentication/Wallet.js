import React, { useEffect, useState } from 'react';
import { Card, Row, CardTitle, Col, Button, Form, FormGroup, Input } from 'reactstrap';
import Logo from '../../assets/images/rahat-logo-blue.png';
import './wallet.css';
import WalletComponent from './WalletComponent';
import { generateOTP, verifyOTP } from '../../services/users';
import { createRandomIdentity } from '../../utils';
import EthCrypto from 'eth-crypto';
import WalletService from '../../utils/blockchain/wallet';
import DataService from '../../services/db';
import { saveUser, saveUserToken } from '../../utils/sessionManager';

const Wallet = () => {
	const [errMessage, setErrMessage] = useState('');
	const [email, setEmail] = useState('');
	const [isWalletLogin, setIsWalletLogin] = useState(false);
	const [tempIdentity, setTempIdentity] = useState(null);
	const [otpLogin, setOtpLogin] = useState(false);
	const [otp, setOtp] = useState(null);

	const toggleLogin = e => {
		e.preventDefault();
		setIsWalletLogin(!isWalletLogin);
	};

	const handleEnterKey = event => {
		if (event.key === 'Enter') {
			event.preventDefault();
			getOtpAndLogin(event);
		}
	};

	const getOtpAndLogin = async e => {
		e.preventDefault();
		setErrMessage('');
		try {
			const result = await generateOTP({ address: email, encryptionKey: tempIdentity.publicKey });

			if (result?.msg && !result?.status) {
				setErrMessage(result.msg);
			}
			if (result.status) setOtpLogin(true);
		} catch (e) {
			setErrMessage('Server Error: Please contact admin.');
		}
	};

	useEffect(() => {
		const identity = createRandomIdentity();
		setTempIdentity(identity);
	}, []);

	const handleVerify = async () => {
		if (otp) {
			const isOTPValid = await verifyOTP({ otp, encryptionKey: tempIdentity.publicKey });
			if (!isOTPValid) {
				setErrMessage('Invalid OTP. Please enter again');
				return;
			}
			saveUser(isOTPValid.user);
			saveUserToken(isOTPValid.token);
			if (isOTPValid.key) {
				const encryptedData = EthCrypto.cipher.parse(isOTPValid.key);
				const decryptedKey = await EthCrypto.decryptWithPrivateKey(tempIdentity.privateKey, encryptedData);
				DataService.savePrivateKey(decryptedKey);
				const wallet = await WalletService.loadFromPrivateKey(decryptedKey);
				DataService.save(wallet);
			}
			window.location.replace('/');
		}
	};

	const handleOtpInput = e => {
		setErrMessage('');
		setOtp(e.target.value);
	};

	return (
		<>
			<Row style={{ height: '100vh', overflow: 'hidden' }}>
				<Col className="left-content d-none d-md-block d-lg-block">
					<span
						style={{
							display: 'flex',
							flexDirection: 'column',
							flexWrap: 'wrap',
							alignItems: 'center',
							justifyContent: 'center',
							marginTop: '350px'
						}}
					>
						<Row style={{ display: 'flex', alignSelf: 'center', alignItems: 'center', justifyItems: 'center' }}>
							<img src={Logo} width="300" alt="rahat logo"></img>
						</Row>
						<Row>
							<div style={{ maxWidth: '410px' }}>
								<p className="description">
									Supporting vulnerable communities with a simple and efficient relief distribution platform.
								</p>
							</div>
						</Row>
					</span>
					<p className="text-copyright  d-none d-sm-block">Copyright © 2021 Rumsan | All Rights Reserved.</p>
				</Col>
				<Col className="right-content">
					<div className=" text-center">
						<p>
							<img
								src={
									window.location.host === 'palika.np.rahat.io'
										? '/img/jaleshwor-logo.png'
										: '/img/unicef-logo-white.png'
								}
								width="100"
							/>
							<br />
							<small style={{ color: 'white' }}>
								{window.location.host === 'palika.np.rahat.io' ? 'Jaleshwor Municipality' : 'Nepal'}
							</small>
						</p>
						{!isWalletLogin && !otpLogin && (
							<div className="mt-4">
								<Row>
									<Col>
										<Card style={{ padding: '20px', maxWidth: '23rem' }}>
											<CardTitle className="text-left">
												<h4>Sign In</h4>
											</CardTitle>
											<p className={`mt-2 ${errMessage ? '' : 'd-none'}`} style={{ color: 'red' }}>
												{errMessage}
											</p>
											<Form>
												<FormGroup className="mt-2">
													<Input
														type="email"
														name="email"
														placeholder="Your email address"
														value={email}
														onKeyDown={handleEnterKey}
														onChange={e => setEmail(e.target.value)}
													/>
												</FormGroup>
											</Form>
											<div className="text-center">
												<Button
													color="primary"
													type="button"
													size="md"
													onClick={getOtpAndLogin}
													style={{ width: 'fit-content' }}
												>
													Log In
												</Button>
											</div>
											<div className="mt-2">
												<p className="mt-2">
													Do you use Rumsan Wallet? &nbsp;
													<span type="button" onClick={toggleLogin} style={{ color: '#326481' }}>
														Click Here
													</span>
												</p>
											</div>
										</Card>
									</Col>
								</Row>
							</div>
						)}
						{isWalletLogin && !otpLogin && <WalletComponent toggleLogin={toggleLogin} />}
						{otpLogin && (
							<>
								<Card style={{ padding: '20px', width: '23rem' }}>
									<p>Please check your email for code and enter here.</p>
									<p className={`mt-2 ${errMessage ? '' : 'd-none'}`} style={{ color: 'red' }}>
										{errMessage}
									</p>
									<div className="p-2">
										<Input className="mt-2 custom-number-input" onChange={handleOtpInput} type="text" name="number" />
									</div>

									<div className="text-center">
										<Button
											type="button"
											onClick={handleVerify}
											size="md"
											style={{ width: '90%', backgroundColor: '#326481' }}
										>
											Verify
										</Button>
									</div>
									<p className="mt-4">If you didn't receive a code, Resend</p>
									<p style={{ color: '#326481' }}>
										<a href="#">
											<u onClick={getOtpAndLogin}>Resend OTP</u>
										</a>
									</p>
								</Card>
							</>
						)}
					</div>
					<p className="text-privacy">
						<img
							src="https://rahat.io/images/logo-white.png"
							width="150"
							className="d-xs-block d-sm-block d-md-none d-lg-none"
						/>
						<br />
						By signing up you acknowledge the&nbsp;
						<a href="https://docs.rahat.io/privacy-policy" className="privacy-policy">
							Privacy Policy
						</a>
						.
					</p>
				</Col>
			</Row>
		</>
	);
};

export default Wallet;
