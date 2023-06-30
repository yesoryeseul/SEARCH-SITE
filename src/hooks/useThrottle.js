// 쓰로틀링 : 마지막 함수가 호출된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것
import { useEffect, useState, useRef } from "react";

const useThrottle = (value, delay = 500) => {
	const [throttledValue, setThrottledValue] = useState(value);
	const lastExecutedTimeRef = useRef(Date.now());
	const timeoutRef = useRef(null);

	// delay 시간 내에 value가 변경되면 쓰로틀링된 throttleValue를 반환, delay 시간이 경과하기 전에는 throttleValue가 변경되지 않음
	useEffect(() => {
		clearTimeout(timeoutRef.current);

		const currentTime = Date.now();
		const elapsedTime = currentTime - lastExecutedTimeRef.current;

		if (elapsedTime >= delay) {
			setThrottledValue(value);
			lastExecutedTimeRef.current = currentTime;
		} else {
			timeoutRef.current = setTimeout(() => {
				setThrottledValue(value);
				lastExecutedTimeRef.current = Date.now();
			}, delay - elapsedTime);
		}

		return () => {
			clearTimeout(timeoutRef.current);
		};
	}, [value, delay]);

	return throttledValue;
};

export default useThrottle;
