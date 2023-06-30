import "./App.css";

import SearchBar from "components/search-bar";
import { useState } from "react";
function App() {
	const [search, setSearch] = useState("");
	const [saveData, setSaveData] = useState([]);

	const onChange = e => {
		setSearch(e.target.value);
	};

	// useEffect(() => {
	// 	async function getData() {
	// 		await axios
	// 			.get(`http://localhost:3000/search?key=${search}`)
	// 			.then(res => res)
	// 			.catch(() => {
	// 				console.log("찾을 수 없는 단어입니다.");
	// 			});
	// 	}
	// 	getData();
	// }, [search]);

	return (
		<>
			<div>
				<SearchBar />
			</div>
		</>
	);
}

export default App;
