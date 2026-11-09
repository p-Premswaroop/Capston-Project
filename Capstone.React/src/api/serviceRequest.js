import axiosInstance from "../lib/axiosInstance";
export const getRequestById = async (id,setRequest) => {
        try {
            const response = await axiosInstance.get(`/GetRequestById?requestId=${id}`);
            if (response.status !== 200) {
                throw new Error('Network response was not ok');
            }
            setRequest(response.data);
        } catch (error) {
            console.error('Failed to fetch request:', error);
        }
    };