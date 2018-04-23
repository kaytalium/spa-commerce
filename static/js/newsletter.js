"use strict"

$('#btn_newsletter').click(function (e) {
    /**
     * prevent the form from being submitted to the sever as we will be handling the 
     * validation and submittion via ajax client side
     */
    e.preventDefault();

    //collect the form fields and its values and convert to json object 
    let form = $('form').serializeArray()
    console.log(form)
    /**
     * validate the value to ensure it match the email pattern 
     * if pattern ok then send email to server for database input
     * else product a message box on screen to let user know invalid entry
     */
    if (form[0].value.validateEmail()) {
        newsLetter.account(form[0].value, form[1].value).success()

    }
    else
        newsLetter.invalid()
})

String.prototype.validateEmail = function () {
    return /^[a-z0-9]+([-._][a-z0-9]+)*@([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,4}$/.test(this)
        && /^(?=.{1,64}@.{4,64}$)(?=.{6,100}$).*/.test(this)
}

var newsLetter = class {

    static account(email, csrf) {
        //send email to the server
        $.ajax({
            type: "POST",
            url: '/newsletter/',
            dataType: "json",
            async: true,
            headers: { 'X-CSRFToken': csrf },
            data: { 'email': email },
            success: (json) => {
                console.log('Json: ', json)

            },
            error: (res) => {
                console.log('res: ', res)

            }
        })
        return this
    }

    static success() {
        this.messageBox("Your account was added sucessfully", 'green')
    }

    static invalid() {
        this.messageBox('The email you entered is invalid, please try again', '#f44336')
    }

    static messageBox(mesg, option) {
        /**
         * Setup the css for the message box element
         */
        let css = {
            "height": '50px',
            'line-height': '30px',
            'z-index': 999999999,
            "background": option,
            'text-align': "center",
            "position": 'fixed',
            "bottom": 150,
            "right": 10,
            "color": '#ffffff',
            "cursor": "pointer",
            "padding": '10px 10px 10px 36px',
            "transition": '0.6s'


        }
        let msgbox = $('#mesgbox')

        if (msgbox.length == 0) {
            console.log('length of box: ', msgbox.length)
            let template = `
            <div id="mesgbox">
            ${mesg}
            </div>
            `
            $('.footer').append(template)
            $('#mesgbox').css(css)
        } else {
            msgbox.css(css)
            msgbox.html(mesg).show()

        }

        $('#mesgbox').click(function () {
            $(this).hide()
        })

        setTimeout(function () {
            // alert('we waited for a bit')
            $('#mesgbox').hide()
            $('#email').val("")
            $('#email').val("Enter your E-mail")
        }, 3000)
    }
}