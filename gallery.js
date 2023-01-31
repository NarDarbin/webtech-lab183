const API = "http://127.0.0.1:7000/image";

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
    return fetch(API, {
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

function post(data){
    fetch(API, {
        headers: {
            'Content-Type': 'application/json'
        },

        method: 'post',
        body: JSON.stringify(data),
    })
    .then(() => {
        buildAlbum();
    });;
}

function update(data){
    fetch(API, {
        headers: {
            'Content-Type': 'application/json'
        },

        method: 'put',
        body: JSON.stringify(data),
    })
    .then(() => {
        buildAlbum();
    });;
}

function deleteRequest(id){
    fetch(API, {
        headers: {
            'Content-Type': 'application/json'
        },

        method: 'delete',
        body: JSON.stringify({id}),
    })
    .then(() => {
        buildAlbum();
    });;
}

function reset(){
    fetch(`${API}/reset`).then(() => {
        buildAlbum();
    });;
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
    filters.search = (data) => { return data.author.toLowerCase().includes(searchQuery.toLowerCase()) || data.tags.toLowerCase().includes(searchQuery.toLowerCase()) };
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

function addRow(table, id, image, author, alt, tags, description){
    table.innerHTML += `
        <tr>
            <td class="image">

                <figure>
                    <img src="${image}" alt="${alt}">
                    <figcaption>${alt}</figcaption>
                </figure>

                <button type="button" class="delete" name=${id}>Delete</button>

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

        if(table.classList.contains('filtered')){
            colorAuthor();
        }

        document.querySelector('button.delete').addEventListener('click', function(e){
            deleteRequest(e.target.name);
        });
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
    });

    document.querySelector('#update').addEventListener('click', function () {    
        const form = document.querySelector('#update_form');

        update(getFormData(form));
    });

    document.querySelector('#reset').addEventListener('click', function () {    
        reset();
    });

    document.querySelector('#search input').addEventListener('input', function(e){
        filterSearch(e.target.value);
    });
}

window.addEventListener('load', function () {
    main();
});