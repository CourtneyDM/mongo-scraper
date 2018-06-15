// Save an article to the Saved Articles list
$(document).on("click", "#saveBtn", function () {
    const title = document.getElementById("scrape-title").innerText;
    console.log(title);

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
    const articleID = $(this).attr("data-article-id");
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
    const articleID = $(this).attr("data-article-id");
    const title = $(this).prev().prev().text();

    $("#comment-title").text(title).attr("data-id", articleID).attr("name", articleID);
    $("#header").attr("value", title);
    $("#noteID").attr("value", articleID);
});

// Retrieve notes
$(document).on("click", "#get-comments", function () {
    // Get the article ID from the View Note button
    const articleID = $(this).attr("name");
    const deleteBtn = `<button class="btn btn-sm btn-danger" aria-label="Close" id="delete-comment">Delete Note</button>`;

    // Send the article ID to the DB to get the note data
    $.get(`/comments/${articleID}`, data => {
        const noteID = data.note._id;
        let comment = `<p>${data.note.body}</p>`;

        // Add the note id to the View Comments button
        $("button").attr("id", "get-comments").attr("data-note-id", noteID);

        // Add the Comment and a Delete Note button to the DOM
        $(`#${articleID}`).append(comment).append(deleteBtn).attr("data-article-id", `"${articleID}"`).attr("data-note-id", `"${noteID}`);
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