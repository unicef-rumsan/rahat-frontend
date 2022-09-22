import 'react';
import { useToasts } from 'react-toast-notifications';
import { TOAST } from '../constants';

export default () => {
	const { addToast } = useToasts();

	return {
		addToast,
		toastSuccess(msg) {
			addToast(msg, TOAST.SUCCESS);
		},
		toastError(msg) {
			addToast(msg, TOAST.ERROR);
		},
		toastWarning(msg) {
			addToast(msg, TOAST.WARNING);
		}
	};
};
