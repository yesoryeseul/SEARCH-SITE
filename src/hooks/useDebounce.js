/*
  디바운싱?
  - 짧은 시간 내의 연속된 함수/event 호출 시, 호출되는 모든 함수를 바로 처리하지 않고 정해진 딜레이 이후에 한번만 처리하는 패턴

  - 성능 향상, 비용 절약(API 콜 횟수 줄임)
*/
import { useEffect, useState } from "react";

// useDebounce.js 커스텀 훅(재사용성)
const useDebounce = (value, delay = 500) => {
	const [debounceVal, setDebounceVal] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			console.log("디바운싱 잘되는지 확인:", value); // e.target.value 딜레이 잘 되는지 디버깅
			setDebounceVal(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debounceVal;
};
export default useDebounce;
