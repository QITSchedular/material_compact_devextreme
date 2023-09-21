import axios from "axios";
import { API_URL } from "./items-master-data";

export const getWarehouse = async () => {
    try {
        const response = await axios.get(`${API_URL}/Commons/Warehouse`);
        const data = response.data;

        return data;
    } catch (error) {
        return error;
    }
};

export const getPeriodIndicator = async () => {
    try {
        const response = await axios.get(`${API_URL}/Commons/Period Indicator`);
        const data = response.data;

        return data;
    } catch (error) {
        return error;
    }
};

export const getSettingConfig = async () => {
    try {
        const response = await axios.get(`${API_URL}/Configs/Get?BranchID=1`);
        const data = response.data;

        return data;
    } catch (error) {
        return error;
    }
};

export const setSettingConfig = async () => {
    try {
        const response = await axios.post(`${API_URL}/Configs/Save`);
        const data = response.data;

        return data;
    } catch (error) {
        return error;
    }
};