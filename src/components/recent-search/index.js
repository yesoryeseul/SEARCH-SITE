import styled from "styled-components";
import { AiOutlineSearch } from "react-icons/ai";
const RecentSearch = ({ data }) => {
	return (
		<Div>
			<div>{data}</div>
			<AiOutlineSearch size={15} />
		</Div>
	);
};

export default RecentSearch;

const Div = styled.div`
	width: 564px;
	margin: 0px auto;
	border-bottom: 2px solid;
	border-right: 1px solid;
	border-left: 1px solid;
	height: 35px;
	position: relative;
	left: 10px;
	padding-top: 10px;
	padding-left: 14px;
	border-image: linear-gradient(to right, #ffcc99, #ffcdf3aa, #65d3ffaa);
	border-image-slice: 1;
	svg {
		position: relative;
		left: 528px;
		bottom: 18px;
		color: gray;
	}
`;
