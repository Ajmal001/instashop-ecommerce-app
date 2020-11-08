export const roundDecimals = (num) => {
	return Math.round(num * 100) / 100;
};

export const formatPrice = (num, fixed = 2) => Number(num).toFixed(fixed);
