export enum NestEvents {
	BEFORE_GET = "before-get",
	AFTER_GET = "after-get",
	BEFORE_SET = "before-set",
	AFTER_SET = "after-set",
	BEFORE_DEL = "before-del",
	AFTER_DEL = "after-del",
}

export { default as Nest } from "./Nest";
