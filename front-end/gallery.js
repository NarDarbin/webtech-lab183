const API = "https://wt.ops.labs.vu.nl/api23/daef2940";

const TABLE_DEFAULT_CONTENT = `
    <caption>Photo Album</caption>
    <tr>
        <th>image</th>
        <th>author</th>
        <th>alt</th>
        <th>tags</th>
        <th>description</th>
    </tr>
`;

const SELECT_DEFAULT_CONTENT = ``;

let filters = {};

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
    fetch(`${API}/item/${data.id}`, {
        method: 'put',
        body: new URLSearchParams(data),
    });
}

function reset(){
    fetch(`${API}/reset`);
    resetTable();
}

function filterAuthor(author){

    const table = document.querySelector('#content_table');
    
    if(table.classList.contains('filtered')){

        table.classList.remove('filtered');

        delete filters.author;
    } else{
        table.setAttribute('class', 'filtered');

        filters.author = (data) => { return data.author === author };
    }

    buildAlbum(filters);
}

function filterSearch(searchQuery){
    filters.search = (data) => { return data.author.includes(searchQuery) || data.tags.includes(searchQuery) };
    buildAlbum(filters)
}

function addFilterListener(element){
    element.addEventListener('click', function () {
        filterAuthor(element.innerHTML);
    });
}

function resetTable(){
    const table = document.querySelector('#content_table');

    table.innerHTML = TABLE_DEFAULT_CONTENT;
}

function resetSelect(updateSelector){
    updateSelector.innerHTML = SELECT_DEFAULT_CONTENT;
}

function addRow(table, image, author, alt, tags, description){
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

function buildAlbum(filters={}){
    get()
    .then(resposne => resposne.json())
    .then((data) => {
        for(const [key, filter] of Object.entries(filters)){
            data = data.filter((data) => filter(data));
        }

        const table = document.querySelector('#content_table');
        const updateSelector = document.querySelector('#image_id');

        resetTable();
        resetSelect(updateSelector);

        for(const entity of data){
            addRow(table, entity.image, entity.author, entity.alt, entity.tags, entity.description);
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

        if(table.classList.contains('filtered')){
            colorAuthor();
        }
    });
}

function colorAuthor(){
    const authors = document.querySelectorAll('.author');

    for(const author of authors){
        author.setAttribute('class', 'filtered_author');
    }
}

function main(){
    buildAlbum();

    document.querySelector('#add').addEventListener('click', function () {    
        const form = document.querySelector('#add_form');

        post(getFormData(form));
        buildAlbum();
    });

    document.querySelector('#update').addEventListener('click', function () {    
        const form = document.querySelector('#update_form');

        update(getFormData(form));
        
        // Without set timeout doesn't work
        setTimeout(buildAlbum, 2000);
    });

    document.querySelector('#reset').addEventListener('click', function () {    
        reset();
        
        // Without set timeout doesn't work
        setTimeout(buildAlbum, 2000);
    });

    document.querySelector('#search input').addEventListener('input', function(e){
        filterSearch(e.target.value);
    });
}

window.addEventListener('load', function () {
    main();
});