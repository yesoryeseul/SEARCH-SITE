const { useState, useEffect } = require("react");

// parameter = (값, 딜레이)
function useDebounce(value, delay = 500) {
	// 받아온 만큼 딜레이를 해줘라
	const [debounceVal, setDebounceVal] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebounceVal(value);
		}, delay);
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debounceVal;
}

export default useDebounce;
