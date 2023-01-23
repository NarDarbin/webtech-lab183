const API = "https://wt.ops.labs.vu.nl/api23/daef2940";

let searchFilter;
let authorFilter;

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

        authorFilter = null;
    } else{
        table.setAttribute('class', 'filtered');

        authorFilter = (data) => { return data.author === author };
    }

    buildFilteredTable();
}

function filterSearch(searchQuery){
    searchFilter = (data) => { return data.author.includes(searchQuery) || data.tags.includes(searchQuery) };
    buildFilteredTable();
}

function buildFilteredTable(){
    let filters = [];

    if(searchFilter){
        filters.push(searchFilter)
    } 
    
    if (authorFilter){
        filters.push(authorFilter);
    }

    buildAlbum(filters);
}

function addFilterListener(element){
    element.addEventListener('click', function () {
        filterAuthor(element.innerHTML);
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

function resetSelect(updateSelector){
    updateSelector.innerHTML = '';
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

function buildAlbum(filters=[]){
    console.log("rebuilding the album");
    get()
    .then(resposne => resposne.json())
    .then((data) => {
        for(const filter of filters){
            data = data.filter((data) => filter(data));
        }

        console.log("data recieved", data);

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
    });
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
        
        setTimeout(buildAlbum, 2000);
    });

    document.querySelector('#reset').addEventListener('click', function () {    
        reset();
        
        setTimeout(buildAlbum, 2000);
    });

    document.querySelector('#search input').addEventListener('input', function(e){
        filterSearch(e.target.value);
    });
}

window.addEventListener('load', function () {
    main();
});