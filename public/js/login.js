$(() => {
    $('#submit').click((e) => {
        e.preventDefault();
        console.log("Click on login");
        const data = {
            email: $('#email').val(),
            password: $('#password').val()
        }

        $.ajax({
        type:'POST',
        data: data,
        dataType: 'json',
        url: 'http://localhost:3000/login',

        beforeSend: () => {
            console.log("Sending request...");
        },
        success: (data) => {
            console.log(data);
            if(confirm("Successfully logged in! Clicca ok to enter chat")){
                window.location.href = "setup.html";
            }
        },
        error: (error) => {
            console.log(data);
            console.log(error);
            alert("Something went wrong: " + error.responseJSON);
        }
    });
});
});