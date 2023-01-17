const API = "https://wt.ops.labs.vu.nl/api23/daef2940";

function get(){

}

function post(data){
    console.log(data);
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

function main(){
    document.querySelector('#submit').addEventListener('click', function () {
        const data = getFormData();
    
        post(data);
    }); 
}

window.addEventListener('load', function () {
    main();
});