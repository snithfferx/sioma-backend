import { showError } from "../notifications";

export async function generateName(
	commonNameSelect: HTMLSelectElement,
	typeSelect: HTMLSelectElement,
	brandSelect: HTMLSelectElement,
	mpnInput: HTMLInputElement,
	skuInput: HTMLInputElement
): Promise<string> {
	const commonName = commonNameSelect.options[commonNameSelect.selectedIndex]?.text || '';
	const type = typeSelect.value !== '0' ? typeSelect.options[typeSelect.selectedIndex]?.text || '' : '';
	const brand = brandSelect.value !== '0' ? brandSelect.options[brandSelect.selectedIndex]?.text || '' : '';
	const mpn = mpnInput.value.trim();
	const sku = skuInput.value.trim();

	const parts = [commonName, type, brand].filter(
		part =>
			part &&
			part !== '-- Seleccionar Nombre Común --' &&
			part !== '' &&
			part !== '-- Seleccionar Tipo --' &&
			part !== '-- Seleccionar Marca --' &&
			part !== ''
	);

	// Add MPN or SKU if available
	if (sku && sku !== '') {
		parts.push(sku);
	}
	if (mpn && sku !== '') {
		parts.push(mpn);
	}

	// Set the generated name
	return parts.join(' ');
}

export function makeItRound(number: number) {
	const amountStr = number.toString();
	const amountParts = amountStr.split('.');
	let integerPart = parseInt(amountParts[0]);
	let decimalPart = parseInt(amountParts[1]);
	if (decimalPart > 0 && decimalPart < 50) {
		decimalPart = 50;
	}
	if (decimalPart > 50 && decimalPart < 100) {
		decimalPart = 90;
	}
	if (decimalPart == 0) {
		integerPart -= 1;
		decimalPart = 99;
	}
	return parseFloat(integerPart + '.' + decimalPart);
}

/**
 * Devuelve el monto con dos digitos
 * @param number Numero
 * @returns Numero con dos digitos
 */
export function makeItTwo(number: number) {
	return parseFloat(number.toFixed(2));
}

/**
 * Calcula el precio final redondeado
 * @param cost Costo del producto
 * @param added Costo adicional
 * @param vat IVA Impuesto adicional (13%)
 * @param rent Rent (1%)
 * @param margin Margen (5%)
 * @returns Precio final redondeado
 */
export function calcPrice(cost: number, added: number, vat: number, rent: number, margin: number) {
	if ((margin/100) < 0.05) {
		margin = 0.05;
		showError("Margen no puede ser menor a 5%");
	}
	// cost = 10, added = 2, vat = 13%, rent = 1%
	// const marginCost = makeItTwo(cost * (margin/100)); // 0.5 cost * (1 + margin/100)
	// const regularCost = makeItTwo(cost + marginCost + added); // 12.5 marginCost + added
	// const rentCost = makeItTwo(regularCost * (rent/100)); // 0.125 regularCost * (1 + rent/100)
	// const iva = makeItTwo((regularCost + rentCost) * (vat/100)); // 1.64125 rentCost * (1 + vat/100)
	// const finalPrice = makeItTwo(regularCost + rentCost + iva); // 14.26625 regularCost + rentCost + iva
	// return makeItRound(finalPrice);
	const price = ((cost * (1 + margin) + added) * (1 + rent)) * (1 + vat);
	return makeItRound(price);
}

/**
 * Calcula el costo adicional redondeado
 * @param price Precio final
 * @param cost Costo del producto
 * @param vat IVA Impuesto adicional (13%)
 * @param rent Rent (1%)
 * @param margin Margen (5%)
 * @returns Costo adicional redondeado
 */
export function calcAddedCost(price: number,cost:number,vat: number, rent: number, margin: number) {
	if ((margin/100) < 0.05) {
		margin = 0.05;
		showError("Margen no puede ser menor a 5%");
	}
	// Main formula ((cost * (1 + margin/100) + added) * (1 + rent/100)) * (1 + vat/100)
	// added = (price / (1 + (rent/100)) * (1 + (vat/100)) - (Cost + (Cost * (1 + (margin/100))))
	// mode2 = (price / (1 + (rent/100)) * (1 + (vat/100)) - (Cost * (1 + (margin/100)))
	// Price = (Cost + (Cost * margin)) + Added) + (((Cost + (Cost * margin)) + Added) * Rent) + ((((Cost + (Cost * margin)) + Added)) + (((Cost + (Cost * margin)) + Added) * Rent)) * IVA)
	// price = 14.50, cost = 10, added = ?, vat = 13%, rent = 1%
	// const regularRentCost = price / (1 + (vat/100)); // 12.832
	// const regularCost = regularRentCost / (1 + (rent/100)); // 12.96
	// const marginCost = makeItTwo(regularCost * (margin/100)); // 12.343
	// const addedCost = makeItTwo(marginCost - cost); // 2.343
	// return Math.floor(makeItRound(addedCost));
	const mode2 = (price / (1 + (rent/100)) * (1 + (vat/100))) - (cost * (1 + (margin/100)));
	return Math.floor(mode2);
}

/**
 * Calcula el precio a partir de un porcentaje del costo
 * @param cost Costo del producto
 * @param percentage Porcentaje
 * @returns Precio
 */
export function calcPriceFromPercentage(cost: number, percentage: number, vat: number, rent: number, margin: number) {
	if ((margin/100) < 0.05) {
		margin = 0.05;
		showError("Margen no puede ser menor a 5%");
	}
	// cost = 10, percentage = 5%, vat = 13%, rent = 1%
	const percentageCost = makeItTwo(cost * (percentage/100)); // 0.5
	// const marginCost = makeItTwo(cost * (margin/100)); // 0.5
	// const regularCost = cost + percentageCost + marginCost; // 15.5
	// const rentCost = regularCost * (rent/100); // 0.155
	// const iva = makeItTwo((regularCost + rentCost) * (vat/100)); // 2.0352
	// const finalPrice = regularCost + rentCost + iva; // 17.6665
	// return makeItRound(finalPrice);
	const price = (((cost + percentageCost) * (1 + margin/100)) * (1 + rent/100)) * (1 + vat/100);
	return makeItRound(price);
}
