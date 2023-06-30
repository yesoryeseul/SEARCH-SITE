import { SearchApi } from "apis/SearchApi";
import useDebounce from "hooks/useDebounce";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { BiSearchAlt, BiTimeFive } from "react-icons/bi";
import useThrottle from "hooks/useThrottle";
import { boxShadow, flexAlignJustifyCenter } from "styles/common";
import { TiDeleteOutline } from "react-icons/ti";

// SearchBar 검색창 컴포넌트
const SearchBar = () => {
	const [search, setSearch] = useState(""); // input값(검색어)
	const [recommendSearch, setRecommendSearch] = useState([]); // 추천 검색어 담을 배열
	const debounceValue = useDebounce(search); // 0.5초 디바운싱하여 검색어 담기
	const throttledValue = useThrottle(search, 500); // 쓰로틀링 비교해보기!
	const [isFocused, setIsFocused] = useState(false); // onFocus, onBlur시 History 컴포넌트 나타낼 수 있는 상태

	// 추천 검색어 db 에서 받아오기
	useEffect(() => {
		const getDbDate = async key => {
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
		if (debounceValue) getDbDate(debounceValue);
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
				/>
				<S.SearchIcon onClick={onSearch}>
					<BiSearchAlt size={30} />
				</S.SearchIcon>
				{isFocused && search.length === 0 && (
					<S.HistoryContainer>
						<S.HistoryTitle>최근 검색어</S.HistoryTitle>
						{recentSearches.length === 0 ? (
							<S.HistorySearchTerms>검색 결과가 없습니다.</S.HistorySearchTerms>
						) : (
							recentSearches.map((term, index) => (
								<S.HistorySearchTerms
									key={index}
									// className={`${selectedIndex === index ? "selected" : ""}`}
									onClick={() => {
										saveSearchTerm(term);
										setSearch("");
										// setSelectedIndex(-1);
									}}
								>
									<S.LeftSearch>
										<BiTimeFive size={20} />
										{term}
									</S.LeftSearch>
									<TiDeleteOutline
										size={22}
										onClick={e => {
											e.stopPropagation(); // 이벤트 버블링 막기
											onRemoveSearch(term);
										}}
									/>
								</S.HistorySearchTerms>
							))
						)}
					</S.HistoryContainer>
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
	padding-bottom: 100px;
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

const S = {
	Wrapper,
	Container,
	Input,
	SearchIcon,
	HistoryContainer,
	HistoryTitle,
	HistorySearchTerms,
	LeftSearch,
};
