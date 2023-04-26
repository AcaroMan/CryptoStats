
'use strict';

var criptosFav = localStorage.getItem('criptos-favoritas') //obtem items guardados na storage
criptosFav = criptosFav == null ? [] : JSON.parse(criptosFav)   //formata a variavel para usar como array
var cloneMedia = $('.coins-list').clone();     //clona elemento linha(tr) da tabela


$('.media-list').empty();   //eleimina o elementod a tabela

var coins = ""
criptosFav.forEach(cripto => {
    coins += cripto +','
});                             //concatena os ids para mandar fazer pedido à API

if(coins.length)
{
    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&sparkline=false&ids="+coins
    
    }).done(function(res){
        criarTabela(res)                    //chamada da função no script.js que gera a tabela
    })
}else{
    tabelaVazia()                           //função que mostra uma mensagem a salientar que não existem coins
}


$( "body" ).on( "click", "[id^=id_]", function() {        //função para obter qual a moeda que é removida dos favoritos      

    let id = $(this).attr('id').split('_')[1]       

    var coinIndex = criptosFav.indexOf(id)
    criptosFav.splice(coinIndex, 1)
    localStorage.setItem('criptos-favoritas', JSON.stringify(criptosFav));              //muda o registo das moedas favoritas
    $(this).css('color', '#646f79')             
    $(this).parent().parent().remove();                                         //remove a linha da tabela   
    if(criptosFav.length==0)    
    {
        tabelaVazia()
    }
    
})


function tabelaVazia(){
    $(".table").parent().append("<h2>Não Há Favoritos</h2>").css({"display":"grid","justify-content":"center"});
    $(".table").remove()
}