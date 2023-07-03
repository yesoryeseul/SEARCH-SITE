import styled from "styled-components";
import { boxShadow } from "styles/common";
import { BiTimeFive } from "react-icons/bi";
import { TiDeleteOutline } from "react-icons/ti";

const RecentSearch = ({
	recentSearches,
	selectedIndex,
	setSearch,
	saveSearchTerm,
	setSelectedIndex,
	onRemoveSearch,
}) => {
	return (
		<S.HistoryContainer>
			<S.HistoryTitle>최근 검색어</S.HistoryTitle>
			{recentSearches.length === 0 ? (
				<S.HistorySearchTerms>검색 결과가 없습니다.</S.HistorySearchTerms>
			) : (
				recentSearches.map((term, index) => (
					<S.HistorySearchTerms
						key={index}
						className={`${selectedIndex === index ? "selected" : ""}`}
						onClick={() => {
							saveSearchTerm(term);
							setSearch("");
							setSelectedIndex(-1);
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
	);
};

export default RecentSearch;

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
	HistoryContainer,
	HistoryTitle,
	HistorySearchTerms,
	LeftSearch,
};
