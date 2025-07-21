import Swal, { type SweetAlertIcon } from 'sweetalert2';

export const showSuccess = (message: string) => {
	Swal.fire({
		icon: 'success',
		title: 'Success',
		text: message,
		timer: 2000,
		showConfirmButton: false
	});
};

export const showError = (message: string) => {
	Swal.fire({
		icon: 'error',
		title: 'Error',
		text: message
	});
};

export const showConfirm = async ( data:{
	message: string;
	icon?: SweetAlertIcon;
	title?: string;
	showCancelButton?: boolean;
	confirmButtonText?: string;
	cancelButtonText?: string;
}) => {
	const result = await Swal.fire({
		icon: data.icon ??'warning',
		title: data.title??'Are you sure?',
		text: data.message,
		showCancelButton: data.showCancelButton??true,
		confirmButtonText: data.confirmButtonText??'Yes',
		cancelButtonText: data.cancelButtonText??'No'
	});
	return result.isConfirmed;
};
