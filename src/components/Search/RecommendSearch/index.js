import styled from "styled-components";
import { boxShadow } from "styles/common";
import { AiOutlineSearch } from "react-icons/ai";

const RecommendSearch = ({
	search,
	recommendSearch,
	selectedIndex,
	saveSearchTerm,
	setSearch,
	setSelectedIndex,
}) => {
	return (
		<S.HistoryContainer>
			<S.SearchWord>
				<AiOutlineSearch size={16} />
				{search}
			</S.SearchWord>
			<S.HistoryTitle>추천 검색어</S.HistoryTitle>
			{recommendSearch.length === 0 ? (
				<S.HistorySearchTerms>추천 검색어가 없습니다.</S.HistorySearchTerms>
			) : (
				recommendSearch.map((term, index) => {
					let highlightedTerm = term
						.split(new RegExp(`(${search})`, "gi"))
						.map((part, idx) => {
							if (part === search) {
								return <S.Highlight key={idx}>{part}</S.Highlight>;
							} else {
								return part;
							}
						});
					return (
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
								<AiOutlineSearch size={20} />
								{highlightedTerm}
							</S.LeftSearch>
						</S.HistorySearchTerms>
					);
				})
			)}
		</S.HistoryContainer>
	);
};

export default RecommendSearch;

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
	HistoryContainer,
	HistoryTitle,
	HistorySearchTerms,
	LeftSearch,
	SearchWord,
	Highlight,
};
