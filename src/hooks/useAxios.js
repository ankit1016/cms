import axios from "axios";
import { useDispatch } from 'react-redux';
import { ThemeActions } from '../redux/reducers/ThemeSlice';
let actionAxios=null
let cancelApi
const useAxios = () => {
    const dispatch = useDispatch();
      
    // ---------------------------------------------------------------error handling function----------------------------------------------------------------
    const errorHandling = (errors) => {
        if (errors instanceof Object) {
            for (const error in errors) {
                errorHandling(errors[`${error}`]);
            }
        } else if (Array.isArray(errors)) {
            errors.map((item) => dispatch(ThemeActions.setError(item)));
        } else {
            dispatch(ThemeActions.setError(errors));
        }
    };

    // ---------------------------------------------------------------create common axios api------------------------------------------------------------------------
    const axiosAPi = axios.create({
        baseURL: process.env.REACT_APP_BACKEND_URL,
        // cancelToken:new axios.CancelToken(c=>cancelApi=c)
        // timeout: 20000,
    });

    // -----------------------------------------------------------------All request come here------------------------------------------------------------------
    axiosAPi.interceptors.request.use(async (request) => {
        dispatch(ThemeActions.setSpinner(true));
        const token = localStorage.getItem('token');
        request.headers = { Authorization: `Bearer ${token}` };
        return request;
    }, (error) => {
        return Promise.reject(error);
    });

    // ----------------------------------------------------------------All response go from here----------------------------------------------------------------------
    axiosAPi.interceptors.response.use((response) => {
        dispatch(ThemeActions.setSpinner(false));
        return response.data;
    }, (error) => {
        dispatch(ThemeActions.setSpinner(false));
        if (error?.response?.status >= 500 && error?.response?.status <= 599) dispatch(ThemeActions.setError("Server Error"));
        else if (error?.response?.status === 404) dispatch(ThemeActions.setError("Not Found"));
        else if (error?.request?.status===0) dispatch(ThemeActions.setError("You are offline"));
        else errorHandling({ ...error?.response?.data });

        return Promise.reject(error);
    });
      actionAxios=axiosAPi
    return axiosAPi;
};

export {actionAxios,cancelApi}

export default useAxios;
