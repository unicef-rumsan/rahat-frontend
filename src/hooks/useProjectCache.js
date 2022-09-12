import { useState } from 'react';
import DataService from '../services/db';

export default (apiFunc, field, props) => {
	const [value, setValue] = useState(props?.defaultValue || '-');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const request = async (...args) => {
		try {
			let cacheValue = await DataService.getProject(props.id, field);
			setValue(cacheValue);
			setLoading(true);
			const result = await apiFunc(...args);
			let dataToCache = {};
			dataToCache[field] = result;
			await DataService.saveProject(props.id, dataToCache);
			if (props.callback) props.callback(result);
			setError(null);
			setValue(result);
		} catch (err) {
			setError(err.message || 'Unexpected Error!');
		} finally {
			setLoading(false);
		}
	};

	return {
		value,
		error,
		loading,
		request
	};
};
