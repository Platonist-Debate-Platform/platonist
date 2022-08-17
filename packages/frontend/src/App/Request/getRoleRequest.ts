import { useConfig } from "@platonist/library";

export const getRoleRequest = async (id: string) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const config = useConfig();
    const url = config.createApiUrl(config.api.config)
    const uri = `${url.origin}/users-permissions/roles/${id}`;
    // console.log(uri);
    const res = await fetch(uri);
    try {
        if (res.ok) {
            const data = res.json();
            return data;
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}