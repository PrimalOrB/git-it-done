var userFormEl = document.querySelector( '#user-form' );
var nameInputEl = document.querySelector( '#username' );
var repoContainerEl = document.querySelector( '#repos-container');
var repoSearchTerm = document.querySelector( '#repo-search-term' );
var languageButtonsEl = document.querySelector( '#language-buttons' );

function getUserRepos( user ) {
    // format the github API url
    var apiUrl = 'https://api.github.com/users/' + user + '/repos'

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            displayRepos(data, user);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch( function ( error ) {
          alert( 'Unable to connect to GitHub' )
      });
}

function formSubmitHandler( event ) {
    event.preventDefault();

        // get value from input element
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos( username );
        nameInputEl.value = "";
    } else {
        alert( 'Please enter a GitHub username' )
    }

    console.log(event)
}

function displayRepos( repos, searchTerm ) {
    if( repos.length === 0 ) {
        repoContainerEl.textContent = 'No repositories found.';
        return
    }


    repoContainerEl.textContent = ""
    repoSearchTerm.textContent = searchTerm

    // loop over repos
    for ( var i = 0; i < repos.length; i++ ) {
        // format repo name
        var repoName = repos[i].owner.login + '/' + repos[i].name;

        // create a container for each repo
        var repoEl = document.createElement( 'a' );
        repoEl.classList = 'list-item flex-row justify-space-between align-center';
        repoEl.setAttribute( 'href', `./single-repo.html?repo=${repoName}`)

        // create a span element to hold repo name
        var titleEl = document.createElement( 'span' );
        titleEl.textContent = repoName;

        // create a status element
        var statusEl = document.createElement( 'span' );
        statusEl.classList = 'flex-row align-center';

        // check if repo has issues or now
        if ( repos[i].open_issues_count > 0 ) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
          statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild( titleEl );
        repoEl.appendChild( statusEl );

        // append container to the dom
        repoContainerEl.appendChild( repoEl );
    }
}

function getFeaturedRepos( language ) {
    var apiUrl = `https://api.github.com/search/repositories?q=${language}+is:featured&sort=help-wanted-issues`;
  
    fetch(apiUrl)
        .then( function( response ) {
            if ( response.ok ) {
                response.json()
                    .then( function( data ) {
                        displayRepos( data.items, language )
                    })
            } else {
                alert( 'Error: ' + response.statusText )
            }
        });
  };

function buttonClickHander( events ) {
    var language = event.target.getAttribute( 'data-language' )
    if ( language ) {
        getFeaturedRepos( language );

        repoContainerEl.textContent = ""
    }
}

userFormEl.addEventListener( 'submit', formSubmitHandler );
languageButtonsEl.addEventListener( 'click', buttonClickHander );