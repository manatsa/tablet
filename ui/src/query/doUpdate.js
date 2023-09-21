
const doUpdate = async (url, token, id, data ) => {
    const response = await fetch(id?`${url}${id}`:url, {
        method: id? 'PUT':'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error:: '+response?.statusText);
    }
    const res=response.json();
    return res;
};

export default doUpdate;