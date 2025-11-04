import defaultAvatar from "/images/user/default-avatar.png";
import notFoundImg from "/images/error/not-found.jpg";

export const getUserAvatar = (name: string | undefined) => {
    return name
        ? (`${import.meta.env.VITE_BE_URL}${name}` as string)
        : defaultAvatar;
};

export const getImage = (name: string | undefined) => {
    return name
        ? (`${import.meta.env.VITE_BE_URL}${name}` as string)
        : notFoundImg;
};
