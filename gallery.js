const API = "https://wt.ops.labs.vu.nl/api23/daef2940";

function get(){
    return fetch(API);
}

function post(data){
    fetch(API, {
        method: 'post',
        body: new URLSearchParams(data),
    });
}

function reset(){

}

function update(){

}

function addRow(){

}

function getFormData(){
    let data = {};

    const entries = new FormData(document.querySelector('form')).entries();

    for (const pair of entries) {
        data[pair[0]] =  pair[1];
    }
    
    return data;
}

function buildAlbum(data){
    console.log(data)
}

function main(){
    document.querySelector('#submit').addEventListener('click', function () {    
        post(getFormData());
    }); 

    get()
    .then(resposne => resposne.json())
    .then((data) => buildAlbum(data));;
}

window.addEventListener('load', function () {
    main();
});