'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    limparCampos()
    document.getElementById('modal').classList.remove('active')
}


const pegarLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const definirLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient))

const deletarCliente = (index) => {
    const dbClient = lerCliente()
    dbClient.splice(index, 1)
    definirLocalStorage(dbClient)
}

const atualizarCliente = (index, client) => {
    const dbClient = lerCliente()
    dbClient[index] = client
    definirLocalStorage(dbClient)
}

const lerCliente = () => pegarLocalStorage()

const criarCliente = (client) => {
    const dbClient = pegarLocalStorage()
    dbClient.push (client)
    definirLocalStorage(dbClient)
}

const camposSaoValidos = () => {
    return document.getElementById('form').reportValidity()
}

const limparCampos = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Novo Cliente'
}

const saveClient = () => {
    if (camposSaoValidos()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value,
            data_de_nascimento: document.getElementById('data').value
        }
        if(celularRegex.test(client.celular)) {}
        else{ throw console.error("Número inválido")}
        if(emailRegex.test(client.email)){}
        else{ throw console.error("E-mail inválido")}
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            criarCliente(client)
            atualizarTabela()
            closeModal()
        } else {
            atualizarCliente(index, client)
            atualizarTabela()
            closeModal()
        }
    }
}



const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
const celularRegex = /^\d{9}$/g



const criarLinha = (client, index) => {
    const novaLinha = document.createElement('tr')
    novaLinha.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>${client.data_de_nascimento}</td>
        <td>
            <button type="button" class="button 1" id="edit-${index}">Editar</button>
            <button type="button" class="button 2" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(novaLinha)
}

const limparTabela = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const atualizarTabela = () => {
    const dbClient = lerCliente()
    limparTabela()
    dbClient.forEach(criarLinha)
}

const preencherCampos = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('data').value = client.data_de_nascimento
    document.getElementById('nome').dataset.index = client.index
}

const editarCliente = (index) => {
    const client = lerCliente()[index]
    client.index = index
    preencherCampos(client)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${client.nome}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editarCliente(index)
        } else {
            const client = lerCliente()[index]
            const response = confirm('Deseja realmente excluir o cliente ${client.nome}')
            if (response) {
                deletarCliente(index)
                atualizarTabela()
            }
        }
    }
}

atualizarTabela()

document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)