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

function update(){

}

function reset(){
    fetch(`${API}/reset`);
    resetTable(table);
}

function resetTable(){
    const table = document.querySelector('#content_table');

    table.innerHTML = `
        <caption>Photo Album</caption>
        <tr>
            <th>image</th>
            <th>author</th>
            <th>alt</th>
            <th>tags</th>
            <th>description</th>
        </tr>
    `;
}

function addRow(table, image, authour, alt, tags, description){
    table.innerHTML += `
        <tr>
            <td class="image">
                <figure>
                    <img src="${image}" alt="${alt}">
                    <figcaption>${alt}</figcaption>
                </figure>
            </td>
            <td>
                <pre>${authour}</pre>                   
            </td>
            <td>${alt}</td>
            <td>${tags}</td>
            <td>${description}</td>
        </tr>
    `
}

function getFormData(){
    let data = {};

    const entries = new FormData(document.querySelector('form')).entries();

    for (const pair of entries) {
        data[pair[0]] =  pair[1];
    }
    
    return data;
}

function buildAlbum(){
    get()
    .then(resposne => resposne.json())
    .then((data) => {
        const table = document.querySelector('#content_table');

        for(const entity of data){
            addRow(table, entity.image, entity.author, entity.alt, entity.tags, entity.description);
        }
    });
}

function main(){
    buildAlbum();

    document.querySelector('#submit').addEventListener('click', function () {    
        post(getFormData());
        resetTable();
        buildAlbum();
    });

    document.querySelector('#reset').addEventListener('click', function () {    
        reset();
        buildAlbum();
    });

    MicroModal.init({
        openTrigger: 'data-custom-open',
        closeTrigger: 'data-custom-close',
        openClass: 'is-open',
        disableScroll: false,
        disableFocus: false,
        debugMode: false
    });
    
}

window.addEventListener('load', function () {
    main();
});