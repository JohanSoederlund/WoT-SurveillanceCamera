



function getJwt() {
    let data = getRoot();
    let url = data.links.login;
    fetch("https://83.250.202.129"+url, {
        method: 'post',
        body:    JSON.stringify({password: "qwe123"}),
        headers: { 'Content-Type': 'application/json' },
    })
    .then( results => {
        return results.json();
    }).then( data => {
        console.log(data);
        //let jwt = data.headers.authorization;
        return data;   
    })  
}

function getRoot() {
    fetch("https://83.250.202.129")
    .then( results => {
        return results.json();
    }).then( data => {
        console.log(data);
        return data;   
    })  
}


module.exports = {
    getJwt
}