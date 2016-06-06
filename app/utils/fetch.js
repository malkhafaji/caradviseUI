export async function getJSON(url, params={}) {
  try {
    params = Object.keys(params).map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }).join('&');

    if (params)
      url += `?${params}`;

    let response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      let result = await response.json();
      return { result };
    } else if (response.status >= 400 && response.status < 500) {
      let result = await response.json();
      return { error: result.errors || result.error };
    } else {
      throw new Error(`Error with status ${response.status}`);
    }
  } catch(error) {
    console.log(error);
    return { error: error.message };
  }
}

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
      return { error: result.errors || result.error };
    } else {
      throw new Error(`Error with status ${response.status}`);
    }
  } catch(error) {
    console.log(error);
    return { error: error.message };
  }
}

export async function deleteJSON(url, data={}) {
  try {
    let response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      return { result: true };
    } else if (response.status >= 400 && response.status < 500) {
      let result = await response.json();
      return { error: result.errors || result.error };
    } else {
      throw new Error(`Error with status ${response.status}`);
    }
  } catch(error) {
    console.log(error);
    return { error: error.message };
  }
}
