import defaultAvatar from "/images/user/default-avatar.png";
import notFoundImg from "/images/error/not-found.jpg";

export const getUserAvatar = (name: string | undefined) => {
    return name ? (`${name}` as string) : defaultAvatar;
};

export const getImage = (name: string | undefined) => {
    return name ? (`${name}` as string) : notFoundImg;
};
