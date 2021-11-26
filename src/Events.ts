enum Events {
	// When a key is set.
	SET = "SET",
	// When a key is deleted.
	DELETE = "DELETE",
	// When a function is called.
	APPLY = "APPLY",
	// When a bulk operation is run.
	BULK = "BULK",
	// When an update is manually called.
	UPDATE = "UPDATE",
}
export default Events;
