import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";

const RelationSearch = ({ search }) => {
	const [relativeData, setRelativeData] = useState();
	// search가 업데이트가 되면 useDebounce로 처리된 값을 debounceVal에 넣어준다.
	const debounceVal = useDebounce(search);

	useEffect(() => {
		async function getData() {
			return await fetch(`http://localhost:3000/search?key=${debounceVal}`)
				.then(res => {
					if (!res.ok) {
						return new Promise.reject("no country found");
					}
					return res.json();
				})
				.then(list => {
					setRelativeData(list);
				})
				.catch(() => {
					console.log("찾을 수 없는 단어입니다.");
				});
		}
		getData();
	}, [debounceVal]);

	console.log(relativeData);
	const onClick = () => {};

	return <div></div>;
};

export default RelationSearch;
