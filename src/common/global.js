import { writable } from 'svelte/store'
import page from 'page.js'

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
export async function ApiFetch (url) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Authorization', 'Bearer ' + token);
   
    return fetch(apiURL+'/'+url, {
        method: "GET",
        headers: headers,
    })
    .then((response) => {
        if ( response.status == 401 ) {
            page.redirect("/auth");
            throw ("unauthorised");
        } else if (response.headers.get("content-type").includes("application/json")){
            return response.json();
        } else {
            throw (response.statusText + ' : ' + response.text());
        }
    })
    .then((json) => {
        if (json.errorMessage) {
            throw (json.result + ' : ' + json.errorMessage);
        } else {
            return json
        }
    });
}

// appel POST/PUT api
export async function ApiPost (url, id, jsPayload) {
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
    })
    .then((response) => {
        let respJson = response.headers.get("content-type").includes("application/json");
        if ( response.status < 200 || response.status > 299 ) {
            //reponse=ko
            if ( respJson && json.errorMessage ) {
                return response.json();
            } else {
                throw (response.statusText + ' : ' + response.text());
            }
        } else {
            //ok
            if ( respJson ) {
                return response.json();
            } else {
                return {};
            }
        }
    })
    .then((json) => {
        console.log(json);
        if (json.errorMessage) {
            throw (json.result + ' : ' + json.errorMessage);
        } else {
            return json
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