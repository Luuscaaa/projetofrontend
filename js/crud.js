/**********************************************************************
 * Objetivo: Realizar a interação de cadastro, consulta, edição e 
 * exclusão de livros
 * Data:29/10/2024
 * Autor: Marcel
 * Versão: 1.0
 **********************************************************************/

// Recebe do HTML o botão de salvar um novo livro
const botaoSalvar = document.getElementById('salvar');

// Função para criar um novo livro no BD
const postLivro = async function() {    
    // URL corrigida com a rota '/api'
    let url = 'http://localhost:3000/books';  // Alterado para a URL correta

    // Receber os dados do formulário
    let titulo      = document.getElementById('title');
    let autor       = document.getElementById('author');  // Alterado para 'author'
    let foto        = document.getElementById('image');
    let valor       = document.getElementById('price');

    // Cria um objeto do tipo JSON
    let livroJSON = {};

    // Criando os atributos do JSON e colocando os valores
    livroJSON.title     = titulo.value;
    livroJSON.author    = autor.value;  // Alterado para 'author'
    livroJSON.image     = foto.value;
    livroJSON.price     = valor.value;

    // Enviar a solicitação POST para a API
    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(livroJSON)
    });

    // Mensagem de interação com o usuário (201 - sucesso no cadastro)
    if (response.status == 201) {
        alert('Registro inserido com sucesso');
        getLivros();  // Atualiza a lista de livros
    } else {
        alert('Não foi possível inserir o registro, verifique os dados enviados');
    }
};

// Função para atualizar um livro existente
const putLivro = async function() {
    // Recebe o ID do livro armazenado na sessão
    let id = sessionStorage.getItem('idLivro');
    if (!id) {
        alert('ID do livro não encontrado na sessão.');
        return;
    }

    const url = 'http://localhost:3000/atualizar/books/'+id;
    // URL correta para atualização

    // Receber os dados do formulário
    let titulo = document.getElementById('title');
    let autor = document.getElementById('author');
    let foto = document.getElementById('image');
    let valor = document.getElementById('price');

    // Cria o objeto JSON
    let livroJSON = {
        title: titulo.value,
        author: autor.value,
        image: foto.value,
        price: valor.value
    };

    // Envia a solicitação PUT para atualizar o livro
    try {
        let response = await fetch(url, {
            method: 'PUT',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(livroJSON)
        });

        if (response.status === 200) {
            alert('Registro atualizado com sucesso');
            getLivros();  // Atualiza a lista de livros
        } else {
            const errorData = await response.json();
            alert('Erro ao atualizar: ' + errorData.message || 'Tente novamente mais tarde.');
        }
    } catch (error) {
        console.error('Erro na requisição PUT:', error);
        alert('Erro ao tentar atualizar o livro. Tente novamente mais tarde.');
    }
};


// Função para excluir um livro
const deleteLivro = async function(idLivro) {
    let url = 'http://localhost:3000/books/' + idLivro;  // URL para excluir o livro

    try {
        // Aguardando a resposta da requisição DELETE
        let response = await fetch(url, { method: 'DELETE' });
        const data = await response.json();  // Obter a resposta em JSON

        if (!response.ok) {  // Verifica se a resposta não foi OK (status != 200)
            alert(`Erro: ${data.message || 'Falha ao excluir o livro'}`);
            return;
        }

        // Caso a exclusão seja bem-sucedida
        alert('Registro excluído com sucesso!');
        getLivros();  // Recarrega a lista de livros
    } catch (error) {
        console.error("Erro ao excluir livro:", error);
        alert('Erro ao excluir o livro.');
    }
};

// (OK) Função para listar todos os livros
const getLivros = async function() {
    let url = 'http://localhost:3000/books';  // Verifique se a API está rodando nesse endereço

    try {
        let response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        let dados = await response.json();

        console.log('Livros retornados:', dados);

        let divListDados = document.getElementById('listDados');
        divListDados.innerText = '';  // Limpa a lista antes de carregar os novos livros

        if (Array.isArray(dados.books)) {
            dados.books.forEach(function(livro) {
                let divDados = document.createElement('div');
                let divTitle = document.createElement('div');
                let divAuthor = document.createElement('div');
                let divPrice = document.createElement('div');
                let divImage = document.createElement('div');  // Para exibir a URL da imagem
                let divOpcoes = document.createElement('div');
                let spanEditar = document.createElement('span');
                let imgEditar = document.createElement('img');
                let spanExcluir = document.createElement('span');
                let imgExcluir = document.createElement('img');

                divDados.setAttribute('id', 'dados');
                divDados.setAttribute('class', 'linha dados');
                imgEditar.setAttribute('src', 'icones/editar.png');
                imgEditar.setAttribute('idLivro', livro.id);
                imgExcluir.setAttribute('src', 'icones/excluir.png');
                imgExcluir.setAttribute('idLivro', livro.id);

                divTitle.innerText = livro.title;
                divAuthor.innerText = livro.author;
                divPrice.innerText = livro.price;

                // Exibe o endereço da imagem se estiver disponível
                if (livro.image) {
                    divImage.innerText = livro.image;  // Exibe a URL da imagem
                } else {
                    divImage.innerText = 'Imagem não disponível';
                }

                divListDados.appendChild(divDados);
                divDados.appendChild(divTitle);
                divDados.appendChild(divAuthor);
                divDados.appendChild(divPrice);
                divDados.appendChild(divImage);  // Adiciona a div com o link da imagem
                divDados.appendChild(divOpcoes);
                divOpcoes.appendChild(spanEditar);
                spanEditar.appendChild(imgEditar);
                divOpcoes.appendChild(spanExcluir);
                spanExcluir.appendChild(imgExcluir);

                imgExcluir.addEventListener('click', function() {
                    let resposta = confirm('Deseja realmente excluir esse item?');
                    if (resposta) {
                        let id = imgExcluir.getAttribute('idLivro');
                        deleteLivro(id);
                    }
                });

                imgEditar.addEventListener('click', function() {
                    let id = imgEditar.getAttribute('idLivro');
                    getBuscarLivro(id);
                });
            });
        } else {
            console.error('Dados retornados não contêm um array de livros:', dados);
            alert('Erro ao carregar os livros. Dados inválidos.');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        alert('Erro ao carregar os livros.');
    }
};

// Função para buscar um livro pelo ID
const getBuscarLivro = async function(idLivro) {
    let url = 'http://localhost:3000/books/' + idLivro;  // Ajuste para a URL local

    let response = await fetch(url);

    let dados = await response.json();

    if (response.status == 200) {
        // Carregar os dados no formulário
        document.getElementById('title').value = dados.title;
        document.getElementById('author').value = dados.author;  // Alterado de subtitle para author
        document.getElementById('image').value = dados.image;
        document.getElementById('price').value = dados.price;

        // Altera o texto do botão salvar para atualizar
        document.getElementById('salvar').innerText = 'Atualizar';

        // Guarda o valor do ID em uma variável de escopo global (pode ser utilizado no click do botão atualizar)
        sessionStorage.setItem('idLivro', idLivro);

    } else {
        alert('Não foi possível localizar o registro.');
    }
};

botaoSalvar.addEventListener('click', function() {
    // Condição para validar se o sistema irá salvar ou atualizar as informações
    if (document.getElementById('salvar').innerText == 'Salvar') {
        postLivro();
    } else if (document.getElementById('salvar').innerText == 'Atualizar') {
        putLivro();
    }
});

window.addEventListener('load', function() {
    getLivros();
});