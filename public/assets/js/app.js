$(document).on("click", "#save", function () {
    $.ajax({
        method: "POST",
        url: "/api/saved/",
        data: {
            title: $(this).prev().prev().text(),
            link: $(this).prev().attr("href")
        }
    }).then(data => alert(data));
});

$(document).on("click", "#delete", function () {
    const thisID = $(this).attr("data-id");
    console.log(`Deleted ID: ${thisID}`);

    $.ajax({
        method: "POST",
        url: "/api/delete",
        data: {
            id: thisID
        }
    }).then(location.reload());

});