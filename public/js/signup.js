$(() => {
    $('#submit').click((e) => {
        e.preventDefault();
        console.log("Click on signin");
        const data = {
            name: $('#name').val(),
            email: $('#email').val(),
            password: $('#password').val()
        }
        $.ajax({
        type:'POST',
        data: data,
        dataType: 'json',
        url: 'http://localhost:3000/signup',
        beforeSend: () => {
            console.log("Sending request...");
        },
        success: (data) => {
            console.log(data);
            if(confirm(data.name + ", you're registered! Click ok to login")){
                window.location.href = "index.html";
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