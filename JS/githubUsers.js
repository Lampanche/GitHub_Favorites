export class GithubUser
{
    static search(username)
    {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({login, name, public_repos, followers}) => ({ // Usando a desestruturação de objeto para simplificar. Passamos o objeto desestruturado e retornamos na função um objeto com as propriedades definidas no shortand
            login,
            name,
            public_repos,
            followers
        }))
    }
}