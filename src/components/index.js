import { SearchApi } from "apis/SearchApi";
import useDebounce from "hooks/useDebounce";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { BiSearchAlt } from "react-icons/bi";
import useThrottle from "hooks/useThrottle";
import { boxShadow, flexAlignJustifyCenter } from "styles/common";
import RecentSearch from "./Search/RecentSearch";
import RecommendSearch from "./Search/RecommendSearch";

// SearchBar 검색창 컴포넌트
const SearchBar = () => {
	const [search, setSearch] = useState(""); // input값(검색어)
	const [recommendSearch, setRecommendSearch] = useState([]); // 추천 검색어 담을 배열
	const debounceValue = useDebounce(search); // 0.5초 디바운싱하여 검색어 담기
	const throttledValue = useThrottle(search); // 쓰로틀링 비교해보기!
	const [isFocused, setIsFocused] = useState(false); // onFocus, onBlur시 History 컴포넌트 나타낼 수 있는 상태
	const [selectedIndex, setSelectedIndex] = useState(-1);
	// 키보드 이벤트나 선택 값 click 시 로컬스토리지에 최근 검색어 배열에 넣기 위한 상태, default는 선택되지 않은 상태(-1)

	// 추천 검색어 db 에서 받아오기
	useEffect(() => {
		const getDbData = async key => {
			try {
				const res = await SearchApi.getSearchList(key);
				console.log("검색 DB 결과: ", res.data);
				const result = res.data;
				setRecommendSearch(result.slice(0, 7)); // 추천 검색어 7개만 보여주기
			} catch (err) {
				console.error(err);
			}
		};
		setRecommendSearch([]); // 추천 검색어 초기화하는 로직 -> 검색어 입력 시 이전 추천 검색어 기록 뜨지 않게함
		if (debounceValue) getDbData(debounceValue);
	}, [debounceValue, search]);

	// 검색 아이콘 클릭 시 로컬 스토리지에 검색어 값이 담기는 로직
	const onSearch = () => {
		if (search === "") return; // 빈값은 저장 x
		saveSearchTerm(search); // 입력한 값 로컬스토리지에 넣기
		setSearch("");
	};

	// 로컬스토리지에 검색어 추가하기
	const saveSearchTerm = term => {
		const recentSearches = getRecentSearches() || [];
		const updateSearch = [
			term,
			...recentSearches.filter(search => search !== term),
		].slice(0, 5);
		// 입력한 검색어 맨 앞에 추가, 중복 값의 경우 filter하여 보여주지 않고 맨 앞에 추가, slice하여 최대 5개 보여주기
		localStorage.setItem("recentSearches", JSON.stringify(updateSearch));
		// recentSearches라는 키 값으로 json 형태로 변환하여 값을 로컬 스토리지에 담기
	};

	// 로컬스토리지 값 가져오기
	const getRecentSearches = () => {
		const saveSearch = localStorage.getItem("recentSearches"); // recentSearches 키 값으로 저장된 최근 검색어 변수에 담기
		return saveSearch ? JSON.parse(saveSearch) : null; // 값이 있다면 자바스크립트 값으로 변환, 없다면 null
	};

	// 최근 검색어 배열
	const recentSearches = getRecentSearches() || [];

	// 최근 검색어 삭제 로직
	const onRemoveSearch = term => {
		const recentSearches = getRecentSearches() || [];
		const deletedSearches = recentSearches.filter(search => search !== term);
		localStorage.setItem("recentSearches", JSON.stringify(deletedSearches));
	};

	// 키보드 이벤트 기능
	const handleKeyDown = e => {
		// 1. enter 발생 시 -> 선택된 인덱스가 -1이 아니라면(선택 된 상태라면-인덱스를 가지고 있을 때) 최근 검색어 배열의 해당 인덱스의 값을 saveSearchTerm 함수를 이용해 로컬 스토리지에 넣는다
		if (e.key === "Enter") {
			if (selectedIndex !== -1) {
				const selectedTerm =
					selectedIndex >= recommendSearch.length // 선택된 인덱스가 추천 검색어 길이보다 같거나 크다면 최근 검색어
						? recentSearches[selectedIndex - recommendSearch.length] // 선택된 인덱스를 최근 검색어 배열의 인덱스로 변환
						: recommendSearch[selectedIndex]; // 그렇지 않으면(추천 검색어 UI일 때) 설정
				saveSearchTerm(selectedTerm);
			} else if (search !== "") {
				// 선택한 상태가 아닌 일반 input에 값 입력 후 enter 이벤트시 검색 값 추가
				saveSearchTerm(search);
			}
			setSearch("");
			setSelectedIndex(-1);
		} else if (e.key === "ArrowUp") {
			e.preventDefault(); // 기본 동작인 스크롤 막기
			// 키보드 위로 올릴 때 이전 인덱스로 가도록(prevIdx - 1) 하되, 만약 이전 인덱스가 0보다 작거나 같으면(제일 처음에 위치해 있다면) 최근검색어 배열길이의 -1(맨 마지막 위치)로 이동
			setSelectedIndex(
				prevIdx =>
					prevIdx <= 0 // 선택된 값이 0번 보다 작은 인덱스일 때(즉 맨 앞에 있을 경우)
						? recommendSearch.length > 0 // 추천 검색어가 있을 때
							? recommendSearch.length - 1 // 추천 검색어 맨 뒤로 selected
							: recentSearches.length - 1 // 최근 검색어일 때 최근 검색어 맨 뒤로 selected
						: prevIdx - 1, // 그 외의 인덱스일 때는 -1씩 하여 이전 값 선택해줌
			);
		} else if (e.key === "ArrowDown") {
			e.preventDefault(); // 기본 동작인 스크롤 막기
			// 키보드를 아래로 내릴 때 다음 인덱스로 가도록(prevIdx + 1) 하되, 만약 인덱스가 최근 검색어 or 추천 검색어 배열 길이의 -1 (마지막에 위치) 이라면 인덱스를 0로 돌려주어 맨 앞으로 이동
			setSelectedIndex(prevIdx =>
				prevIdx ===
				(recommendSearch.length > 0
					? recommendSearch.length - 1
					: recentSearches.length - 1)
					? 0
					: prevIdx + 1,
			);
			// 추천 검색어가 활성화되면 마지막 값일 때 인덱스를 0으로 돌려주고 아니라면 최근 검색어가 마지막일 때 0으로 돌려줌, 그 외는 index + 1씩 해줌
		}
	};

	return (
		<S.Wrapper>
			<S.Container>
				<S.Input
					value={search}
					onFocus={() => setIsFocused(true)}
					onBlur={() => {
						// onBlur와 최근 검색어 onClick이 겹쳐서 onBlur만 실행되는 에러 때문에 추가(에러 핸들링)
						setTimeout(() => {
							setIsFocused(false);
						}, 100);
					}}
					onChange={e => setSearch(e.target.value)}
					placeholder="검색어를 입력하세요."
					onKeyDown={handleKeyDown}
				/>
				<S.SearchIcon onClick={onSearch}>
					<BiSearchAlt size={30} />
				</S.SearchIcon>
				{isFocused && search.length === 0 && (
					<RecentSearch
						recentSearches={recentSearches}
						selectedIndex={selectedIndex}
						setSearch={setSearch}
						saveSearchTerm={saveSearchTerm}
						setSelectedIndex={setSelectedIndex}
						onRemoveSearch={onRemoveSearch}
					/>
				)}
				{isFocused && search.length > 0 && (
					<RecommendSearch
						search={search}
						recommendSearch={recommendSearch}
						selectedIndex={selectedIndex}
						saveSearchTerm={saveSearchTerm}
						setSearch={setSearch}
						setSelectedIndex={setSelectedIndex}
					/>
				)}
			</S.Container>
		</S.Wrapper>
	);
};

export default SearchBar;

const Wrapper = styled.div`
	position: relative;
	${flexAlignJustifyCenter}
	flex-direction: column;
	height: 100vh;
	max-width: 600px;
	margin: 0 auto;
	padding-bottom: 260px;
`;

const Container = styled.div`
	position: relative;
	box-sizing: border-box;
	display: flex;
	width: 100%;
`;

const Input = styled.input`
	width: 100%;
	border: none;
	border-radius: 40px;
	outline: none;
	padding: 20px 50px 18px 20px;
	font-size: 18px;
	font-weight: bold;
	${boxShadow}

	:focus {
		outline: 2px solid #5c7ff1;
	}
`;

const SearchIcon = styled.div`
	position: absolute;
	right: 5px;
	top: 4px;
	cursor: pointer;
	height: 50px;
	width: 70px;
	background: linear-gradient(
		135deg,
		rgba(92, 131, 241, 1) 0%,
		rgba(92, 110, 241, 1) 100%
	);
	border-radius: 30px;
	${flexAlignJustifyCenter}

	& svg {
		color: #fff;
		display: flex;
	}
`;

const HistoryContainer = styled.div`
	position: absolute;
	top: 100%;
	border-radius: 16px;
	margin-top: 10px;
	padding-bottom: 23px;
	width: 100%;
	background: #fff;
	${boxShadow}
`;

const HistoryTitle = styled.h3`
	font-size: 16px;
	font-weight: bold;
	padding: 30px 20px 20px;
`;

const HistorySearchTerms = styled.div`
	display: flex;
	flex-wrap: wrap;
	padding: 10px 20px;
	justify-content: space-between;
	align-items: center;
	&.selected {
		background-color: #f1f1f1;
	}
	&:hover {
		background-color: #f1f1f1;
	}
	& svg {
		cursor: pointer;
		color: #666;
	}
`;

const LeftSearch = styled.div`
	display: flex;
	align-items: center;

	& svg {
		margin-right: 6px;
		color: #666;
	}
`;

const SearchWord = styled.p`
	display: flex;
	align-items: center;
	font-size: 16px;
	font-weight: bold;
	padding: 10px 14px;
	margin-top: 20px;
	background-color: #f1f1f1;
	border-left: thick double #5c78f1;

	& svg {
		margin-right: 6px;
	}
`;

const Highlight = styled.p`
	font-weight: bold;
	color: #5c78f1;
`;

const S = {
	Wrapper,
	Container,
	Input,
	SearchIcon,
	HistoryContainer,
	HistoryTitle,
	HistorySearchTerms,
	LeftSearch,
	SearchWord,
	Highlight,
};
