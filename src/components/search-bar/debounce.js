import { useEffect, useState } from "react";

function useDebounce(val, delay = 200) {
	const [debounceVal, setDebounceVal] = useState(val);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebounceVal(val);
		}, delay);
		return () => {
			clearTimeout(handler);
		};
	}, [val, delay]);
	return debounceVal;
}

export default useDebounce;
