import { APIURL } from "./utils";


const fetchWithToken = async(url, options={})=> {
    const token = localStorage.getItem('access');

    //If token is available add it to request headers
    if(token){
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`
        }
    }

    const response = await fetch(`${url}`, options);

    if(response.status === 401){
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken){
            // Fetch new access token using the refresh token
            const refreshResponse = await fetch(`${APIURL}refresh/`,{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'refresh': refreshToken})
            });

            if(refreshResponse.ok){
                const data = await refreshResponse.json();
                localStorage.setItem('access', data.access);
                return fetchWithToken(url, options);
            }else{
                localStorage.removeItem('access');
                localStorage.removeItem('refresh');
            }
        }
    }

    return response
}

export {fetchWithToken};