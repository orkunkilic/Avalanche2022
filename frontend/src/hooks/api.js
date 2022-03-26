export const post = async (url, data) => {
    const response = await fetch('http://localhost:3000/'+url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
