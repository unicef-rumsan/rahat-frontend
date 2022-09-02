import React from 'react';
import { Modal, ModalBody } from 'reactstrap';
import PropTypes from 'prop-types';

export default function MaskLoader(props) {
	const { isOpen, message, size } = props;
	return (
		<>
			<Modal isOpen={isOpen} className={props.className || ''} size={size ? size : ''} centered>
				<ModalBody>
					<div style={{ padding: 10 }}>
						{message || 'Please wait...'} <span style={{ fontSize: 12 }}>This may take a while</span>
					</div>
					<div className="spinner-grow text-primary" role="status">
						<span className="sr-only">Loading...</span>
					</div>
					<div className="spinner-grow text-secondary" role="status">
						<span className="sr-only">Loading...</span>
					</div>
					<div className="spinner-grow text-success" role="status">
						<span className="sr-only">Loading...</span>
					</div>
					<div className="spinner-grow text-danger" role="status">
						<span className="sr-only">Loading...</span>
					</div>
					<div className="spinner-grow text-warning" role="status">
						<span className="sr-only">Loading...</span>
					</div>
					<div className="spinner-grow text-info" role="status">
						<span className="sr-only">Loading...</span>
					</div>
					<div className="spinner-grow text-dark" role="status">
						<span className="sr-only">Loading...</span>
					</div>
					<div className="spinner-grow text-light" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				</ModalBody>
			</Modal>
		</>
	);
}

MaskLoader.propTypes = {
	isOpen: PropTypes.bool.isRequired
};
