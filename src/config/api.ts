/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "./axios.customize";
// user
export const callGetUsers = (query: string) => {
    return axios.get(`/users?${query}`);
};

export const callGetUserById = (id: number) => {
    return axios.get(`/users/${id}`);
};

export const callCreateUser = (data: any) => {
    return axios.post(`/users`, { ...data });
};

export const callUpdateUserById = (id: number, data: any) => {
    return axios.patch(`/users/${id}`, { ...data });
};

export const callDeleteUserById = (id: number) => {
    return axios.delete(`/users/${id}`);
};

export const callUploadImage = ({ file, folder }: any) => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    return axios({
        method: "post",
        url: `/users/upload-image?folder=${folder}`,
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};
