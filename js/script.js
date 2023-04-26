'use strict';

let path = window.location.pathname; //Obter o url todo

let page = path.split("/").pop(); //Para obter em que página se encontra, através do "corte" do url

var extras = new URL(document.location).searchParams.get("extras") //Verifica se o botão de outras opções foi ativado

var criptosFav = localStorage.getItem('criptos-favoritas')
criptosFav = criptosFav == null ? [] : JSON.parse(criptosFav)

if(page == "" || page == "index.html") //Verificação para ver se o utilizador se encontra na pagina principal ou favoritos para dar destaque ao botão da navbar
{
	$('#favoritos').removeClass("active"); //Caso seja a pagina princial remove a class active dos favoritos
	$('#home').addClass("active"); //E mete no botão pagina principal
}
else if(page == "favoritos.html")
{
	$('#home').removeClass("active");
	$('#favoritos').addClass("active");	
}

function criarTabela(res) // Função para a criação da tabela tanto na página inicial como na página de favoritos        
{
    $.each(res, function(index, result){
        // Criar novo clone
        var liMedia = cloneMedia.clone();
        // Alterar no clone 
        $('.coin-position', liMedia).text(result.market_cap_rank !=null ? "#" + result.market_cap_rank : "N/A")
        $('.coin-logo', liMedia).attr('src', result.image);
        $('.coin-logo', liMedia).attr('alt', result.id);
        if(page == "" || page == "index.html") //Colocação do nome em upper caso exista a palavra coin
        {
            if(result.name.toUpperCase().includes("COIN"))
            {
                $('.coin-nome', liMedia).text(result.name.toUpperCase())
            }
            else
            {
                $('.coin-nome', liMedia).text(result.name)
            }
        }
        else
        {
            $('.coin-nome', liMedia).text(result.name)
        }

		$('.coin-nome', liMedia).attr('href', './detalhes.html?cripto='+result.id)
		if(extras != null && extras.length) //Verificação para caso seja ativado o botão das outras opções, mudar o simbolo de € e $
		{
			$('.coin-valor', liMedia).text(result.current_price + " €")
		}
		else
		{
			$('.coin-valor', liMedia).text(result.current_price + " $")
		}
        // $('a', liMedia).attr('href', 
        // 	"https://www.imdb.com/title/" + result.imdbID)
        // Adicionar o clone à tabela original
        $('.media-list').append(liMedia);
        $('.fav', liMedia).attr('id', "id_" + result.id);

        if(criptosFav.indexOf(result.id ) > -1) //Ao criar cada linha de uma coin é verificada se a mesma é favorita e se sim mudada a cor do botão
        {
            $('.fav', liMedia).css('color', '#e74c3c')
        }
    })
}

function adicionarFav(elem, id) //Função para fazer com que guarde no localstorage os ids das moedas favoritas
{
	if(criptosFav == null) //Caso não existam moedas favoritas é criado um array para adicionar ao localstorage
    {
        criptosFav.push(id) //É adicionado o id ao array
        localStorage.setItem('criptos-favoritas', JSON.stringify(criptosFav)); //É adicionado ao local storage o array
        elem.css('color', '#e74c3c') //É mudada a cor do botão dos favoritos
    }
    else
    {
        if(criptosFav.indexOf(id) > -1) //Verificação para caso a moeda já exista no localStorage em vez de adicionar remove
        {
            var coinIndex = criptosFav.indexOf(id) //Devolve a posição do array em que se encontra o id da coin a remover
            criptosFav.splice(coinIndex, 1) //Remove-se o id da coin pretendida do array
            localStorage.setItem('criptos-favoritas', JSON.stringify(criptosFav)); //Volta-se a definir o array do localStorage
            elem.css('color', '#646f79') //Muda-se a cor do botão favoritos desta moeda
        }
        else
        {
            criptosFav.push(id)
            localStorage.setItem('criptos-favoritas', JSON.stringify(criptosFav));
            elem.css('color', '#e74c3c')
        }
    }
}