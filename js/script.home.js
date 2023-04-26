
'use strict';

let valuePesquisa = new URL(document.location).searchParams.get("cripto") //obter os parametros enviados por GET 

let lista10 = new URL(document.location).searchParams.get("lista-10") //obter os parametros enviados por GET 

var url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"

var cloneMedia = $('.coins-list').clone();

$('.media-list').empty(); 

var criptosFav = localStorage.getItem('criptos-favoritas') //Obter a lista de criptos guardadas no localStorage
criptosFav = criptosFav == null ? [] : JSON.parse(criptosFav) //Caso haja algo no local storage faz o decode do array caso não exista 
                                                            //inicia o array

if(extras != null && extras.length) //Verificação para caso seja ativado o botão de outras opções
{
    $('#extras').prop('checked', true);
    $("#lista-10").attr("disabled", true);
    $(".slider.round.lista-10").css('cursor', "default");
    $(".slider.round.lista-10").css('opacity', "40%");
    var url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&category=smart-contract-platform&order=volume_desc&page=1&sparkline=false"
    $('.titulo').text("TOP CRIPTOS - Smart Contracts ")
    $('.action.text-right.valor').text("Valor (€)")
}
else if(lista10 != null && lista10.length) //Verificação para caso seja ativado o botão de lista de 10
{
    $('#lista-10').prop('checked', true);
    $("#extras").attr("disabled", true);
    $(".slider.round.extras").css('cursor', "default");
    $(".slider.round.extras").css('opacity', "40%");
    var url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    $('.titulo').text("TOP 10 CRIPTOS")
}

if(valuePesquisa != null && valuePesquisa.length){ //Verifica se o utilizador pesquisou algo, para que seja feito o pedido com esse termo
	$('#cripto').val(valuePesquisa);
	
    //Feito para que o tamanho do titulo não ocupe tanto tamanho na página
    $('.titulo').text("Resultados da pesquisa - " + (valuePesquisa.length < 30 ? valuePesquisa:valuePesquisa.slice(0,30)+"...") + "  ( TOP 100 ) ")

    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/search?query=" + valuePesquisa,
    }).done(function(res){
        var coins = ""

        $.each(res['coins'], function(index, result){
            coins += result.id + ","  //Obter os ids das coins que foram pesquisados e organizar ex [id,id2,id3]
        })

        if(coins.length) //Caso exista algum resultado para a pesquisa feita, é feito um pedido para obter as moedas
        {
            $.ajax({
                method: "GET",
                url: url + "&ids=" + coins
        
            }).done(function(res){
                criarTabela(res)
            })  
        }
        else //Caso não exista é mostrado sem resultados
        {
            $(".table").parent().append("<h2>Sem Resultados</h2>").css({"display":"grid","justify-content":"center"})
            $(".table").remove()    
        }
    })
}
else
{
    $.ajax({
        method: "GET",
        url: url

    }).done(function(res){
        criarTabela(res) //Depois de fazer o pedido chama a função para criar a tabela do ficheiro script.js
    })
}

$( "body" ).on( "click", "[id^=id_]", function() {  //Função que deteta quando um dos botões de favoritos é carregado para chamar a função do script.js

    let id = $(this).attr('id').split('_')[1]

    adicionarFav($(this), id)
})


$("#lista-10").change(function() { //Verifica se o botão da lista de 10 foi ativado para ativar o mesmo e desativar o botão dos extras
    if(this.checked)
    {
        $("#extras").attr("disabled", true);
        $(".slider.round.extras").css('cursor', "default");
        $(".slider.round.extras").css('opacity', "40%");
    }
    else
    {
        $("#extras").attr("disabled", false);
        $(".extras").css('cursor', "pointer");
        $(".extras").css('opacity', "100%");
    }
    $('#form-search').submit(); //Submissão dos form para fazer o pedido do botão carregado
});

$("#extras").change(function() { //Verifica se o botão das outras opções foi ativado para ativar o mesmo e desativar o botão dos extras
    if(this.checked)
    {
        $("#lista-10").attr("disabled", true);
        $(".slider.round.lista-10").css('cursor', "default");
        $(".slider.round.lista-10").css('opacity', "40%");
    }
    else
    {
        $("#lista-10").attr("disabled", false);
        $(".slider.round.lista-10").css('cursor', "pointer");
        $(".slider.round.lista-10").css('opacity', "100%");
    }
    $('#form-search').submit(); //Submissão dos form para fazer o pedido do botão carregado
});


//Função para remover as 10 criptos

$('#remover').on('click', function(){
    var lista = $('.coins-list')
    lista[0].remove()
    for (let i = 0; i < 10; i++) { 
        lista[i].remove()  //remove a linha da tabela   
    }
})