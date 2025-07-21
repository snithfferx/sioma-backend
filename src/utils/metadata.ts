import { showError, showSuccess } from './notifications';

export interface MetadataGroup {
	id: number;
	name: string;
	metadata: Array<{
		id: number;
		name: string;
		tooltip?: string;
		format?: string;
	}>;
}

export async function fetchMetadataDescription(
	commonNameId: string,
	categoryId: string,
	productTypeId: string
): Promise<MetadataGroup[]> {
	const response = await fetch(
		`/api/metadata/description?commonNameId=${commonNameId}&categoryId=${categoryId}&productTypeId=${productTypeId}`
	);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json();
}

export function collectMetadataValues(groups: MetadataGroup[]): Array<{ id: number; value: string }> {
	return groups
		.flatMap(group =>
			group.metadata.map(meta => ({
				id: meta.id,
				value: (document.getElementById(`metadata_${meta.id}`) as HTMLInputElement)?.value || ''
			}))
		)
		.filter(mv => mv.value.trim() !== '');
}

async function saveMetadataValue(Id: number) {
	const productId = (document.getElementById('productId') as HTMLInputElement).value;
	const value = (document.getElementById(`metadata_${Id}`) as HTMLInputElement).value;

	if (!productId) {
		showError('Please save the product first');
		return;
	}

	try {
		const response = await fetch('/api/metadata/metadata-values', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				product_id: productId,
				metadata_id: Id,
				value
			})
		});

		if (!response.ok) {
			throw new Error('Failed to save metadata value');
		}

		showSuccess('Metadata value saved successfully');
	} catch (error) {
		console.error('Error saving metadata value:', error);
		showError('Failed to save metadata value');
	}
}

async function cleanMetadataValue(Id: number) {
	const productId = (document.getElementById('productId') as HTMLInputElement).value;
	const value = (document.getElementById(`metadata_${Id}`) as HTMLInputElement).value;

	if (!productId) {
		showError('Please save the product first');
		return;
	}

	try {
		const response = await fetch('/api/metadata/metadata-values', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				product_id: productId,
				metadata_id: Id,
				value
			})
		});

		if (!response.ok) {
			throw new Error('Failed to save metadata value');
		}

		showSuccess('Metadata value saved successfully');
	} catch (error) {
		console.error('Error saving metadata value:', error);
		showError('Failed to save metadata value');
	}
}

async function redoMetadataValue(id: number) {
	(document.getElementById(`saveinput_${id}`) as HTMLButtonElement).classList.remove('hidden');
	(document.getElementById(`redoinput_${id}`) as HTMLButtonElement).classList.remove('hidden');
	(document.getElementById(`cleaninput_${id}`) as HTMLButtonElement).classList.remove('hidden');
	(document.getElementById(`metadata_${id}`) as HTMLInputElement).removeAttribute('disabled');
}

function editMetadataValue(id: number) {
	(document.getElementById(`saveinput_${id}`) as HTMLButtonElement).classList.remove('hidden');
	(document.getElementById(`redoinput_${id}`) as HTMLButtonElement).classList.remove('hidden');
	(document.getElementById(`cleaninput_${id}`) as HTMLButtonElement).classList.remove('hidden');
	(document.getElementById(`metadata_${id}`) as HTMLInputElement).removeAttribute('disabled');
}
