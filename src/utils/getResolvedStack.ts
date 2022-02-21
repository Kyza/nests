import getStack from "./getStack";

export default async function getResolvedStack(): Promise<any[]> {
	const stack = await getStack();

	for (let i = 0; i < stack.length; i++) {
		const callSite = stack[i];
		const resolvedStack = {};

		const keys = ["columnNumber", "lineNumber", "fileName", "functionName"];
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const getKey = `get${key.charAt(0).toUpperCase()}${key.slice(1)}`;
			// @ts-ignore
			resolvedStack[key] = callSite[getKey]();
		}
		// @ts-ignore
		stack[i] = resolvedStack;
	}

	return stack;
}
