export const decodeLink = (url: string) => decodeURI(url.replaceAll('-', ' '));

export const encodeLink = (url: string) => encodeURI(url.replaceAll(' ', '-'));
