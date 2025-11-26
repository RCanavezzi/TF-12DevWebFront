export default (name: "jwt") => {
    const v = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
    return v ? decodeURIComponent(v) : null;
};
