import axios from "axios";
import RecentSearch from "components/recent-search";
import useDebounce from "./debounce";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = () => {
	const [search, setSearch] = useState("");
	const [saveData, setSaveData] = useState([]);
	const [state, setState] = useState(false);

	const [relativeData, setRelativeData] = useState([]);
	const debounceVal = useDebounce(search);

	const onChange = e => {
		setSearch(e.target.value);
		if (e.target.value == "") {
			setRelativeData("");
			setState(false);
		}
		setState(false);
	};

	const onKeyPress = e => {
		if (e.key === "Enter") {
			onClickSaveData();
		}
	};

	useEffect(() => {
		axios
			.get(`http://localhost:3000/search?key=${debounceVal}`)
			.then(res => setRelativeData(res.data))
			.catch(() => console.log("err"));
	}, [debounceVal]);
	const relativeMap = Array.from(relativeData);

	function onClickSaveData() {
		const result = saveData.filter(v => v !== search);
		const saveResult = [search, ...result.slice(0, 4)];
		setSaveData(saveResult);
	}

	localStorage.setItem("saveData", JSON.stringify(saveData));
	let arr = localStorage.getItem("saveData");
	arr = JSON.parse(arr);
	arr = [...arr];

	return (
		<Container>
			<Wrapper className="datalist-container">
				<SearchIcon onClick={onClickSaveData}>
					<AiOutlineSearch size={15} />
				</SearchIcon>
				<SearchInput
					type="text"
					list="relativeList"
					onClick={() => setState(true)}
					onChange={onChange}
					placeholder="검색어 입력"
					onKeyPress={onKeyPress}
				/>
			</Wrapper>

			{state && (
				<div>
					{arr.map((data, idx) => (
						<RecentSearch data={data} idx={idx} />
					))}
				</div>
			)}
			<datalist id="relativeList">
				{relativeMap.map(val => (
					<option value={val} className="datalist" />
				))}
			</datalist>
		</Container>
	);
};
export default SearchBar;

const Container = styled.div`
	margin: 0px auto;
	width: 1000px;
	height: 600px;
	margin-top: 150px;
`;
const Wrapper = styled.div`
	margin: 0 auto;
	width: 600px;
	display: flex;
`;

const SearchIcon = styled.div`
	position: relative;
	height: 20px;
	left: 430px;
	top: 105px;
	z-index: 100;
	svg {
		color: gray;
	}
`;

const SearchInput = styled.input`
	margin: 0px auto;
	margin-top: 100px;
	width: 300px;
	height: 25px;
`;
