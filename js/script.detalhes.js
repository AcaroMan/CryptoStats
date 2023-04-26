'use strict';

let coin = new URL(document.location).searchParams.get("cripto") //obter os parametros enviados por GET    

var criptosFav = localStorage.getItem('criptos-favoritas') //Obter a lista de criptos guardadas no localStorage
criptosFav = criptosFav == null ? [] : JSON.parse(criptosFav) //Caso haja algo no local storage faz o decode do array caso não exista 
                                                                //inicia o array

//Verificar a quantidade de vezes que é acedido à pagina de detalhes

var totalacessos = localStorage.getItem('total-acessos')
totalacessos = totalacessos == null ? 0 : JSON.parse(totalacessos)
totalacessos++
localStorage.setItem('total-acessos', totalacessos)
console.log("Total de acessos à página de detalhes: "  + totalacessos)

if(coin==null || coin==""){
    window.location.href = '/'; //Caso não seja passada nenhuma moeda por GET o utilizador é redirecionado para a página inicial 
}
else
{
    $.ajax({
        method: "GET",
        url: "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids="+ coin +"&order=market_cap_desc&per_page=1&page=1&sparkline=false"

    }).done(function(res){
        if(!res.length)
        {
            window.location.href = '/'; //Caso o id da moeda que é passado seja inválido, é redirecionado para a página inicial
        }

        if(criptosFav.indexOf(coin) > -1) //Caso a moeda que está a ser visualizada seja uma das favoritas a cor do botão dos favoritos
        {                                       // é ativado
            $('.fav').css('color', '#e74c3c')
        }

        $('title').text("Detalhes " + res[0].name + " - CriptoStats") 
        $('#cripto-rank').text( res[0].market_cap_rank !=null ? "Ranking: #"+ res[0].market_cap_rank : "Ranking: N/A")
        $('.cripto-logo').attr("src",res[0].image)
        $('.cripto-name').text(res[0].name)
        $('.cripto-valor').text(res[0].current_price != null ? res[0].current_price + " $" : 'N/A')
        $('.cripto-valor-mudanca').append(res[0].price_change_24h != null ? res[0].price_change_24h + " $" : 'N/A' )
        $('.cripto-valor-mudanca').addClass(res[0].price_change_24h > 0 ? "text-success" : "text-danger" )
        $('.cripto-valor-mudanca').children().addClass(res[0].price_change_24h > 0 ? "fa-arrow-up":"fa-arrow-down")
        $('.cripto-moeda-quantidade').text(res[0].circulating_supply != null ? res[0].circulating_supply : 'N/A')
        $('.cripto-moeda-quantidade-total').text(res[0].max_supply != null ? res[0].max_supply : 'N/A')
        $('.cripto-max').text(res[0].high_24h != null ? res[0].high_24h + " $" : "N/A $" )
        $('.cripto-min').text(res[0].low_24h != null ? res[0].low_24h +" $" : "N/A $")
        $('.updated').text("Last Updated: "+ (new Date(res[0].last_updated)).toString())

        $('.valor-maximo').text(res[0].ath != null ? res[0].ath +" $" : "N/A $")
        $('.data-maximo').text(res[0].ath_date.split("T")[0] != null ? res[0].ath_date.split("T")[0] : "N/A")
        $('.mudanca-valor').append(res[0].ath_change_percentage != null ? res[0].ath_change_percentage + " %" : "N/A %")
        $('.mudanca-valor').addClass(res[0].ath_change_percentage > 0 ? "text-success" : "text-danger" )
        $('.mudanca-valor').children().addClass(res[0].ath_change_percentage > 0 ? "fa-arrow-up" : "fa-arrow-down")
    })
}


$('#favorito').on('click', function() { //Função ativada ao carregar no botão de favoritos que chama a função no ficheiro script.js 

    adicionarFav($(this), coin)
})