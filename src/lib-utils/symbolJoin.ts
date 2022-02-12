export default function symbolJoin(
	array: (string | number | symbol)[],
	joiner: string | number | symbol
): string {
	if (array.length === 1) return array[0].toString();
	let result = "";
	for (let i = 0; i < array.length; i++) {
		result += `${i === 0 ? "" : joiner.toString()}${array[i].toString()}`;
	}
	return result;
}
