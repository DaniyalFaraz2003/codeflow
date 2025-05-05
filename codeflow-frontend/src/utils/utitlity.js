export const getAvatar = (name) => {
    return name.split(" ").map((word, index, array) => (index === 0 || index === array.length - 1) ? word[0] : "").join("").toUpperCase();
}