import * as symbols from "./symbols";

type Nest<Data extends object> = Data & typeof symbols;

export default Nest;
