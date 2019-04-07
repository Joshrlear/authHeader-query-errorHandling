'use strict'

const searchUrl = 'https://api.github.com/users/';

const permissionHeader = 'application/vnd.github.v3+json';

// const oAuthToken = 'b3b5415a60ce9a184565ce218eaaadb2634abcd4';

// html for header, above repo results
function generateHeader(username) {
    return `
    <header class="header" id="header">
            <h2 class="results">Repos for ${username}</h2>
        </header>
    `
}

// html for repo results
function generateResults(responseArray) {
    console.log(responseArray);
    const repoName = responseArray.name;
    const repoLink = responseArray.html_url;
    const repoDescription = responseArray.description;
    const repoUpdated= responseArray.updated_at;
    return `
    <div class="repo-result" id="repo-result">
        <h3 class="repoName">${repoName}</h3>
        <p><em>${repoUpdated}</em></p>
        <h3>description</h3>
        <p class="repo-description">${repoDescription}</p>
        <a href="${repoLink}" target="_blank"><button role="button" type="button" class="repo-link">Visit Repo</button></a>
    </div>
    `
}

function displayResults(responseJson, username){
    console.log('trying to display results');
    const repoArray = [];
    const header = generateHeader(username);
    for (let i in responseJson) {
        console.log('looping');
        repoArray.push(generateResults(responseJson[i]));
    }

    console.log('appending to HTML');
    $('#results-container').append(header, repoArray);
}

// fetches api and handles errors
function handleApi(username) {
    console.log('creating url');
    const url = searchUrl + username + '/repos';
    
    console.log('creating options');
    const options = {
        headers: new Headers({
            'Content-Type': permissionHeader,
            // 'Authorization': oAuthToken
        })
    };
    console.log('fetching...');
    fetch(url, options)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, username))
    .catch(err => $('#results-container').text(`Uh oh! Little issue: ${err.message}`)
    );

}

function removePrev() {
    $('#results-container').empty();
}

// on page load listen for form submit
// pass value to handleApi()
$(function handleSubmit() {
    $('#form').submit(function(event) {
        removePrev();
        console.log('submitting');
        event.preventDefault();
        const inputVal = $(this).find('#user-input').val();
        console.log(inputVal);
        handleApi(inputVal);
        this.reset();
    })
})