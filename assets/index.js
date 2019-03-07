// Declare stockList array
$(document).ready(function () {
const stocksList = ['AAPL', 'IRBT', 'SBUX', 'AMZN', 'CRM',];
const validationList = [];
const populateValidationList = function() {
    queryUrl='https://api.iextrading.com/1.0/ref-data/symbols'
    $.ajax({
        url: queryUrl,
        method: 'GET'
    }).then(function (response) {
        response.forEach(obj => {validationList.push(obj.symbol.toUpperCase());});
  });
};
populateValidationList();
const renderBtns = function () {
  $('#listButtons').empty();
  for (let i = 0; i < stocksList.length; i++) {
    const stkBtn = $('<button class="symbolBtn btn btn-dark w-100 m-2">');
    stkBtn.attr('stockSymbol', stocksList[i]);
    stkBtn.text(stocksList[i]);
    $('#listButtons').append(stkBtn);
  }
}
renderBtns();
const renderInfo = function () {
    $('#listInfo').empty();
    const stockSymbol = $(this).attr('stockSymbol');
    const queryUrl = `https://api.iextrading.com/1.0/stock/${stockSymbol}/batch?types=logo,quote,news&last=10`;
    $.ajax({
        url: queryUrl,
        method: 'GET'
    }).then(function (response) {
        $('#listInfo').empty();
        const companyName = response.quote.companyName;
        const stockSymbol = response.quote.symbol;
        const stockPrice = response.quote.latestPrice;
        const logoLink = response.logo.url;
        const companyCard = $(`
            <div class="card flex-row dlex-wrap w-100">
                <div class="card-header ">
                    <img class="card-img-top w-25 p-2" src=${logoLink} alt=${companyName}>
                    <strong>${companyName}</strong>
                </div>
                <div class="card-block">
                    <h5 class="card-title p-2">Symbol: ${stockSymbol}</h5>
                    <h5 class="card-text p-2">Price: ${stockPrice}</h5>
                </div>
            </div>`);
        $('#listInfo').append(companyCard);
        for (let i = 0; i < response.news.length; i++) {
            const headlineCard = $(`
                <div class="card my-2 w-100">
                    <div class="card-header">
                 <strong>Headline #${i+1}</strong>
                        <p class="card-text">${response.news[i].headline}</p>
                        <a href=${response.news[i].url}>Read More</a>
                    </div>
                </div>`);
            $('#listInfo').append(headlineCard);
        }
    });
}
const addButton = function () {
    const addSymbol = $('#addStock').val().toUpperCase();
    let symbolIndex = validationList.indexOf(addSymbol);
    if (symbolIndex > -1) {
       stocksList.push(addSymbol);
       renderBtns();
    } else {
        alert("Stock Symbol "+addSymbol+" is not Valid")
    }
}
$('#listButtons').on('click', '.symbolBtn', renderInfo);
$('#plusButton').on('click', addButton);
});
