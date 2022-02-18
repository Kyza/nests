type ResolvedStack = {
	columnNumber: NodeJS.CallSite["getColumnNumber"];
	fileName: NodeJS.CallSite["getFileName"];
	functionName: NodeJS.CallSite["getFunctionName"];
	lineNumber: NodeJS.CallSite["getLineNumber"];
};

export default ResolvedStack;
