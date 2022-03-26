

export const post = async (url, data) => {
    let base;
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        base = 'http://localhost:3000/'
    } else {
        base = 'https://expirydator.herokuapp.com/'
    }
    const response = await fetch(base+url, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return response.json();
}
