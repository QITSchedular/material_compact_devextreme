import axios from "axios";
import { API_URL } from "./items-master-data";
import { toastDisplayer } from "../api/qrgenerators";

export const getWarehouse = async () => {
    try {
        const response = await axios.get(`${API_URL}/Commons/Warehouse`);
        const data = response.data;

        return data;
    } catch (error) {
        return toastDisplayer('error', error.message);
    }
};

export const getIssueSerise = async () => {
    try {
        const response = await axios.get(`${API_URL}/Commons/Series?BranchID=1&ObjType=60`);
        const data = response.data;

        return data;
    } catch (error) {
        return toastDisplayer('error', error.message);
    }
};

export const getReceiptSerise = async () => {
    try {
        const response = await axios.get(`${API_URL}/Commons/Series?BranchID=1&ObjType=59`);
        const data = response.data;

        return data;
    } catch (error) {
        return toastDisplayer('error', error.message);
    }
};

export const getDeliverySerise = async () => {
    try {
        const response = await axios.get(`${API_URL}/Commons/Series?BranchID=1&ObjType=15`);
        const data = response.data;

        return data;
    } catch (error) {
        return toastDisplayer('error', error.message);
    }
};

export const getSettingConfig = async () => {
    try {
        const response = await axios.get(`${API_URL}/Configs/Get?BranchID=1`);
        const data = response.data;

        return data;
    } catch (error) {
        // return toastDisplayer('error', error.message);
    }
};

export const setSettingConfig = async () => {
    try {
        const response = await axios.post(`${API_URL}/Configs/Save`);
        const data = response.data;

        return data;
    } catch (error) {
        return toastDisplayer('error', error.message);
    }
};