import { axiosInstance } from "./@core";

export const SearchApi = {
	getSearchList(key) {
		return axiosInstance.get(`/search`, { params: { key } });
	},
};
