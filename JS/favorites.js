import { GithubUser } from "./githubUsers.js"
// classe que ira conter a lógica  dos dados
// como os dados serão estruturados
export class Favorites
{
    constructor(root)
    {
        this.root = document.querySelector(root)
        this.load()
    }

    load()
    {
       this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [] 
       
    }

    save()
    {
        localStorage.setItem("@github-favorites:",JSON.stringify(this.entries))
    }

    async add(username) // Transformando esta função em assincrona => Podemos usar o await para "esperar uma função async terminar de carregar"
    {
        try // Estrutura para capturar erros. A aplicação não "para", pois temos um tratamento para caso ocorra algum erro.
        {
            const userExists = this.entries.find(entry => entry.login === username) // find me retornará o dado do array quando o retorno da função for true

            if(userExists)
            {
                throw new Error ("Usuário já cadastrado")
            }

            const user = await GithubUser.search(username)
            
            if(user.login === undefined)
            {
                throw new Error ("O usuário não existe!")                                
            }
               
            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        
        }catch(error)
        {
            alert(error.message)
        }
          
    }

    delete(user)
    {
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login) // filter trabalha criando um outro array sem o dado onde a função retorna false => Conceito de imutabilidade dos methods High order do JS
        this.entries = filteredEntries
        this.update()
        this.save()   
    }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites
{
    constructor(root)
    {
        super(root)

        this.tbody = this.root.querySelector("table tbody")

        this.update()
        this.onadd()        
    }

    onadd()
    {
        const addButton = this.root.querySelector(".search button")
        addButton.onclick = () => 
        {
            const {value} = this.root.querySelector(".search input")
            this.add(value)
        }
    }

    update()
    {
        this.removeAllTr()
        
        this.entries.forEach((user)=>{
            const row = this.creatRow()

            row.querySelector(".user img").src = `https://github.com/${user.login}.png`
            row.querySelector(".user img").alt = `Imagem de ${user.name}`
            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user span").textContent = user.login
            row.querySelector(".user a").href = `https://github.com/${user.login}`
            row.querySelector(".repositories").textContent = user.public_repos
            row.querySelector(".followers").textContent = user.followers

            row.querySelector(".remove").onclick = () => 
            {
                const itsOk = confirm("Tem certeza que deseja excluir o cadastro?")
                if(itsOk)
                {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })

    }

    creatRow()
    {
        const tr = document.createElement("tr")

        tr.innerHTML = 
        `
        <td class="user">
            <img src="https://github.com/maykbrito.png" alt="">
            <a href="https://github.com/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>maykbrito</span>
            </a>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            9589
        </td>
        <td>
            <button class="remove">&times;</button>
        </td>   
        
        `
        return tr
    }
    
    removeAllTr()
    {
        this.tbody.querySelectorAll("tr")
        .forEach((tr)=> tr.remove())
    }

}