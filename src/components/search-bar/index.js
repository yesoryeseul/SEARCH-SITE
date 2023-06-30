import axios from "axios";
import RecentSearch from "components/recent-search";
import RelationSearch from "components/relation-search";
import useDebounce from "components/relation-search/useDebounce";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import styled from "styled-components";
const SearchBar = () => {
	const [search, setSearch] = useState("");
	const [saveData, setSaveData] = useState([]);

	// 연관검색
	const [relativeData, setRelativeData] = useState([]);
	const debounceVal = useDebounce(search);

	const onChange = e => {
		setSearch(e.target.value);
		if (e.target.value == "") {
			setRelativeData("");
		}
	};

	useEffect(() => {
		axios
			.get(`http://localhost:3000/search?key=${debounceVal}`)
			.then(res => setRelativeData(res.data))
			.catch(() => console.log("err"));
	}, [debounceVal]);
	const newArray = Array.from(relativeData);

	// 최근 검색 데이터 함수
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
			<div>Search</div>
			<Wrapper>
				<SearchIcon onClick={onClickSaveData}>
					<AiOutlineSearch size={20} />
				</SearchIcon>
				<SearchInput
					// onClick했을 때 최근 검색어가 나와야함 > state true, false로 해주기
					// onClick={onChange}
					onChange={onChange}
					placeholder="검색어 입력"
				></SearchInput>
			</Wrapper>
			<div>
				{arr.map(data => (
					<RecentSearch data={data} />
				))}
			</div>
			{newArray.map(data => (
				<RelationSearch data={data} />
			))}
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
	left: 560px;
	top: 117px;
	z-index: 100;
	svg {
		color: gray;
	}
`;

const SearchInput = styled.input`
	margin-top: 100px;
	width: 600px;
	height: 40px;
	border: 6px solid;
	padding-left: 10px;
	:focus {
		outline: none;
		position: relative;
	}
	::placeholder {
		color: gray;
		position: relative;
		top: 1px;
	}
	border-image: linear-gradient(to right, #ffcc99, #ffcdf3aa, #65d3ffaa);
	border-image-slice: 1;
	font-size: 15px;
	position: relative;
`;
