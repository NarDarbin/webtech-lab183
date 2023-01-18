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

function update(data){
    console.log(data);
    fetch(`${API}/item/${data.id}`, {
        method: 'put',
        body: new URLSearchParams(data),
    });
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

function addRow(table, id, image, author, alt, tags, description){
    table.innerHTML += `
        <tr>
            <td class="image">

                <figure>
                    <img src="${image}" alt="${alt}">
                    <figcaption>${alt}</figcaption>
                </figure>

            </td>
            <td>
                <pre class="author">${author}</pre>                   
            </td>
            <td>${alt}</td>
            <td>${tags}</td>
            <td>${description}</td>
        </tr>
    `
}

function addOption(updateSelector, id, author){
    updateSelector.innerHTML += `
        <option value="${id}">${author}</option>
    `;
}

function getFormData(form){
    let data = {};

    const entries = new FormData(form).entries();

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
        const updateSelector = document.querySelector('#image_id');

        for(const entity of data){
            addRow(table, entity.id, entity.image, entity.author, entity.alt, entity.tags, entity.description);
            addOption(updateSelector, entity.id, entity.author);
        }

        const authors = document.querySelectorAll('.author');
        for(const author of authors){
            addFilterListener(author);
        }

        const updateButtons = document.querySelectorAll('.update');
        for(const updateButton of updateButtons){
            addUpdateListener(updateButton);
        }
    });
}

function main(){
    buildAlbum();

    document.querySelector('#add').addEventListener('click', function () {    
        const form = document.querySelector('#add_form');

        post(getFormData(form));
        resetTable();
        buildAlbum();
    });

    document.querySelector('#update').addEventListener('click', function () {    
        const form = document.querySelector('#update_form');

        update(getFormData(form));

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