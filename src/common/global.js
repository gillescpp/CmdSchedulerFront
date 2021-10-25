//import { writable } from 'svelte/store'
import page from 'page.js'

export const baseURL = window.location.origin;
export const apiURL = baseURL + "/cmdscheduler";

//token en cours
let token = '';
let rights = '';

// authentification
export async function Auth(usr, pass) {
    let url = apiURL+'/auth';
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Authorization', 'Basic ' + btoa(usr + ":" + pass));
   
    return fetch(url, {
        method: "POST",
        headers: headers
    })
    .then((response) => {
        let contentJS = false;
        if ( response.headers.get("content-type") ) {
            contentJS = ( response.headers.get("content-type").indexOf("application/json") !== -1);
        }      
        if (contentJS) {
            return response.json();
        } else {
            return response.text().then(data => ({
                errorMessage: response.statusText,
                result: response.status
            }));
        }
    })
    .then((data) => {
        if (data.result !== undefined) {
            throw (data.result + ' : ' + data.errorMessage);
        } else {
            token = data.token;
            rights = data.rights;
            return;
        }
    });
}

//check présence token
export function IsAuth() {
    return !(token=="");
}

//ras token
export function ClearToken() {
    token = "";
}

// recup drtoi associé a un code fonction
export function Right(code) {
    if ( code == "" ) {
        return {
            allowed: true,
            read_only: true
        };        
    } else if ( IsAuth() && rights ) {
        for (let k in rights) {
            if (k === code) { 
              return rights[k]; 
            }
        } 
    } 
    return {
        allowed: false,
        read_only: true
    };
}

// appel GET api
export async function ApiFetch (entryPoint, params) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=UTF-8');
    headers.append('Authorization', 'Bearer ' + token);

    const apiget = new URL(apiURL+'/'+entryPoint);
    if ( params ) {
        for (let [k, v] of params) {
            apiget.searchParams.append(k, v);
        }
    }
   
    return fetch(apiget.href, {
        method: "GET",
        headers: headers,
    })
    .then((response) => {
        let contentJS = false;
        if ( response.headers.get("content-type") ) {
            contentJS = ( response.headers.get("content-type").indexOf("application/json") !== -1);
        }  

        if ( response.status == 401 ) {
            page.redirect("/auth");
            throw ("unauthorised");
        } else if (contentJS){
            return response.json();
        } else {
            throw (response.status + " : " + response.statusText);
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


// appel GET api, en batch pour récuperer tous les records
export async function ApiFetchFull (entryPoint, params) {
    let allData = [];
    let morePagesAvailable = true;
    let currentPage = 0;

    //fore la limite au max
    if (!params) {
        params = new Map()
    }
    params.set("limit", 100);
  
    while(morePagesAvailable) {
      currentPage++;
      params.set("page", currentPage);
      const response = await ApiFetch(entryPoint, params)
      let jsresp = await response;
      jsresp.data.forEach(e => allData.push(e));
      morePagesAvailable = jsresp.page < jsresp.totalPage;
    }
    return allData;
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
        let contentJS = false;
        if ( response.headers.get("content-type") ) {
            contentJS = ( response.headers.get("content-type").indexOf("application/json") !== -1);
        }  

        if ( response.status == 401 ) {
            page.redirect("/auth");
            throw ("unauthorised");
        } else if (contentJS) {
            return response.json();
        } else if ( response.status < 200 || response.status > 299 ) {
            throw (response.statusText + ' : ' + response.statusText);
        } else {
            return {};
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
