import { SearchApi } from "apis/SearchApi";
import useDebounce from "hooks/useDebounce";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { BiSearchAlt } from "react-icons/bi";
import useThrottle from "hooks/useThrottle";

// SearchBar 검색창 컴포넌트
const SearchBar = () => {
	const [search, setSearch] = useState(""); // input값(검색어)
	const [recommendSearch, setRecommendSearch] = useState([]); // 추천 검색어 담을 배열
	const debounceValue = useDebounce(search); // 0.5초 디바운싱하여 검색어 담기
	const throttledValue = useThrottle(search, 500); // 쓰로틀링 비교해보기!
	const [isFocused, setIsFocused] = useState(false); // onFocus, onBlur시 History 컴포넌트 나타낼 수 있는 상태

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
		console.log("검색 아이콘 클릭 시 로컬 스토리지에 검색어 값이 담기는 로직");
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
			</S.Container>
		</S.Wrapper>
	);
};

export default SearchBar;

const Wrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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
	box-shadow: 0px 0px 18px 5px rgba(67, 100, 224, 0.1);

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
	display: flex;
	justify-content: center;
	align-items: center;

	& svg {
		color: #fff;
		display: flex;
	}
`;

const S = {
	Wrapper,
	Container,
	Input,
	SearchIcon,
};
