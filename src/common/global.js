import { writable } from 'svelte/store'

export const apiURL = "http://localhost:8100/cmdscheduler"
export const activeTab = writable("");


//token en cours
let token = ''

// authentification
export async function Auth(usr, pass) {
    let url = apiURL+'/auth';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Authorization', 'Basic ' + btoa(usr + ":" + pass));

    let i = 0;
    await new Promise(r => {
        setTimeout(r, 2000)
        i++;
    });
    i++
    
    return fetch(url, {
        method: "POST",
        headers: headers
    }).then((response) => {
        return response.json()
    })
    .then((data) => {
        if (data.errorMessage) {
            throw (data.result + ' : ' + data.errorMessage);
        } else {
            token = data.token
            return
        }
    });
}

//check présence token
export function IsAuth(usr, pass) {
    return !(token=="")
}

// appel GET api
export function ApiFetch (url) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Authorization', 'Bearer ' + token);
    
    return fetch(apiURL+'/'+url, {
        method: "GET",
        headers: headers,
    }).then((response) => {
        return response.json();
    })
    .then((data) => {
        if (data.errorMessage) {
            throw (data.result + ' : ' + data.errorMessage);
        } else {
            return data;
        }
    });
}

// appel POST/PUT api
export function ApiPost (url, id, jsPayload) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Authorization', 'Bearer ' + token);
    let destUrl = apiURL+'/'+url;
    let verb = "POST"
    if ( id > 0 ) {
        verb = "PUT"
        destUrl+= "/" + id
    }
    
    return fetch(destUrl, {
        method: verb,
        headers: headers,
        body: JSON.stringify(jsPayload),
    }).then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(data => {
            // json
            if (data.errorMessage) {
                throw (data.result + ' : ' + data.errorMessage);
            } else {
                return data
            }
          });
        } else {
          return response.text().then(text => {
            // this is text, do something with it
          });
        }

    });
}

/*
async function myFetch(myRequest) {
  try {
    const reponse = await fetch(myRequest); // Fetch the resource
    const text = await response.text(); // Parse it as text
    const data = JSON.parse(text); // Try to parse it as json
    // Do your JSON handling here
  } catch(err) {
    // This probably means your response is text, do you text handling here
  }
}
*/