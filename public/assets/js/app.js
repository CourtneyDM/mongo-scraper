// Save an article to the Saved Articles list
$(document).on("click", "#save", function () {
    $.ajax({
        method: "POST",
        url: "/api/saved/",
        data: {
            title: $(this).prev().prev().text(),
            link: $(this).prev().attr("href")
        }
    }).then(data => console.log(data));
    location.reload();
});

// Delete an article from the Saved Articles list
$(document).on("click", "#delete", function () {
    const thisID = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/api/delete/article",
        data: {
            id: thisID
        }
    }).then(data => console.log(data));
    location.reload();
});

// Add a comment from the modal form
$(document).on("click", "#new-comment", function () {
    const thisID = $(this).attr("data-id");
    const title = $(this).prev().prev().text();

    $("#comment-title").text(title).attr("data-id", thisID).attr("name", thisID);
    $("#header").attr("value", title);
    $("#noteID").attr("value", thisID);
});

// Retrieve notes
$(document).on("click", "#get-comments", function () {
    const thisID = $(this).attr("name");
    $.get(`/comments/${thisID}`, data => {
        let comment = data.note.body;
        $("button").attr("id", "get-comments").attr("data-id", data.note_id);

        $(`#${thisID}`).append(`<p>${comment}</p>`)
            .append(`<button class="btn btn-sm btn-danger" aria-label="Close" id="delete-comment" data-name="${thisID}" data-id="${data.note._id}">
        Delete Note</button>`);
    });
});

$(document).on("click", "#delete-comment", function () {
    const thisID = $(this).attr("data-id");
    const articleID = $(this).attr("data-name");
    console.log(articleID);

    $.ajax({
        method: "POST",
        url: "/api/delete/note",
        data: {
            id: thisID
        }
    }).then(data => {
        console.log(data)
    });
    location.reload();
});