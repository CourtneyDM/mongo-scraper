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
    const articleID = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/api/delete/article",
        data: {
            id: articleID
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
    // Get the article ID from the View Note button
    const articleID = $(this).attr("name");

    // Send the article ID to the DB to get the note data
    $.get(`/comments/${articleID}`, data => {
        const noteID = data.note._id;
        let comment = `<p>${data.note.body}</p>`;

        // Add the note id to the View Comments button
        $("button").attr("id", "get-comments").attr("data-id", noteID);

        // Add the Comment and a Delete Note button to the DOM
        $(`#${articleID}`).append(comment)
            .append(`<button class="btn btn-sm btn-danger" aria-label="Close" id="delete-comment" data-name="${articleID}" data-id="${noteID}">
        Delete Note</button>`);
    });
});


// Delete notes
$(document).on("click", "#delete-comment", function () {
    const noteID = $(this).attr("data-id");
    // const articleID = $(this).attr("data-name");

    $.ajax({
        method: "POST",
        url: "/api/delete/note",
        data: {
            id: noteID
        }
    }).then(data => {
        console.log(data)
    });
    location.reload();
});