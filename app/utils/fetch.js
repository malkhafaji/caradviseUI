export async function postJSON(url, data={}) {
  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      let result = await response.json();
      return { result };
    } else if (response.status >= 400 && response.status < 500) {
      let result = await response.json();
      throw new Error(result.errors || result.error);
    } else {
      throw new Error(`Error with status ${response.status}`);
    }
  } catch(error) {
    console.log(error);
    return { error: error.message };
  }
}
