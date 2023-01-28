export async function GET_FETCH(props) {
    return (fetch(`${props.url}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(async (response) => {
        const resp = await response.json()
        return resp
    })
    )
}