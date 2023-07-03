import styled from "styled-components";
const RecentSearch = ({ data, idx }) => {
	return (
		<Div>
			<div>{data}</div>
		</Div>
	);
};

export default RecentSearch;

const Div = styled.div`
	width: 280px;
	margin: 0px auto;
	border: 1px solid gray;
	position: relative;
	left: 5px;
	padding: 5px;
	font-size: 12px;
`;
