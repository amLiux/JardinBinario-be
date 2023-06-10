export const goBackOneMonth = ():Date => {
	const today = new Date();
	const oneMonthBackTimestamp = today.setMonth(today.getMonth()-1);
	return new Date(oneMonthBackTimestamp);
}