import * as symbols from "./symbols";

type Nest<Data extends object> = { (value: Data): Data } & Data &
	typeof symbols;

export default Nest;
