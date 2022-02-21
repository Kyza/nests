export type StoreOptions = {
	type: "STORE";
	id?: string;
	serialize?: boolean;
	trace?: boolean;
};

export default {} as { [id: string]: StoreOptions };
