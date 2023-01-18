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
    resetTable();
}

function filterTable(author){
    resetTable();

    const table = document.querySelector('#content_table');
    
    if(table.classList.contains('filtered')){

        table.classList.remove('filtered');
        buildAlbum();

    } else{
        table.setAttribute('class', 'filtered');

        buildAlbum((data) => { return data.author === author });
    }
}

function addFilterListener(element){
    element.addEventListener('click', function () {
        filterTable(element.innerHTML);
    });
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
                <pre class="author">${authour}</pre>                   
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

function buildAlbum(filter){
    get()
    .then(resposne => resposne.json())
    .then((data) => {

        if(filter){
            data = data.filter((data) => filter(data));
        }

        const table = document.querySelector('#content_table');

        for(const entity of data){
            addRow(table, entity.image, entity.author, entity.alt, entity.tags, entity.description);
        }

        const authors = document.querySelectorAll('.author');
        for(const author of authors){
            addFilterListener(author);
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