"use strick"
let wishlist = JSON.parse(sessionStorage.getItem('wishlist'))

$("#wishlistlink").click(function (e) {
    e.preventDefault()

    let userData = $(this).data().prodid
    console.log("wishlist: ", wishlist)

    if (!wishlist) {
        wishlist = []
        wishlist.push(userData)
        // console.log(JSON.stringify(wishlist))
        sessionStorage.setItem('wishlist', JSON.stringify(wishlist))
    } else {
        let isSet = false
        wishlist.forEach(element => {
            if (element == userData)
                isSet = true
        });

        if (!isSet) {
            wishlist.push(userData)
            sessionStorage.setItem('wishlist', JSON.stringify(wishlist))
            alert(`You now have ${wishlist.length} items to view in your wishlist`)
        }else{
            alert("This item is already in your wishlist")
        }

    }
    
})