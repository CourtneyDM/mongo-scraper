// Load the article upon page load
$.getJSON("/articles", data => {
    data.map(result => {
        const article = `<p>
        <h2 data-id=${result._id}>${result.title}</h2>
        <a href='${result.link}'>${result.link}</a></p><br/>`;

        $(".articles").append(article);
    });
});

$("#get-articles").on("click", () => {

    $(".articles").empty();

    $.getJSON("/scrape", () => {
        console.log("Scrape completed");
        // data.map(result => {
        //     const article = `<p>
        //     <h2 data-id=${result._id}>${result.title}</h2>
        //     <a href='${result.link}'>${result.link}</a></p><br/>`;

        //     $(".articles").append(article);

        // });
        // alert("Scrape completed.");
    });
});