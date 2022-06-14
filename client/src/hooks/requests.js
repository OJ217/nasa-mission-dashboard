const API_URL = "http://localhost:5000/api/v1";

async function httpGetPlanets() {
  return await( await fetch(`${API_URL}/planets`)).json();
}

async function httpGetLaunches() {
  const fetchedLaunches = await( await fetch(`${API_URL}/launches`)).json();
  return fetchedLaunches.sort((launchA, launchB) => {
    return launchA.flightNumber - launchB.flightNumber;
  })
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_URL}/launches`, 
      { 
        method: "post", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(launch), 
      }
    );
  } catch (error) {
    return {
      ok: false,
    }
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_URL}/launches/abort/${id}`, { method: "put" });
  } catch (error) {
    console.log(error);
    return {
      ok: false
    }
  }
}

async function httpLaunchSucceed(id) {
  try {
    return await fetch(`${API_URL}/launches/succeed/${id}`, { method: "put" });
  } catch (error) {
    console.log(error);
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
  httpLaunchSucceed,
};