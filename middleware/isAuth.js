export default function ({ app, store, error, redirect }) {
    // const hasToken = !!app.$apolloHelpers.getToken()
    const userInCookie = app.$cookies.get("loggedInUser");
    console.log('userInCookie', userInCookie);
    const isUserLoggedIn = userInCookie && userInCookie && userInCookie.userType == "USER";
    if (!isUserLoggedIn) {

        app.$notifier.showMessage({
            content: "Please login first to see this page",
            color: "warning",
        });
        return redirect('/shop');
    }
}