export default function ({ app, store, error,redirect }) {
    // const hasToken = !!app.$apolloHelpers.getToken()
    const adminInCookie = app.$cookies.get("loggedInUser");
    console.log('adminInCookie',adminInCookie);
    const isAdminLoggedIn = adminInCookie &&  adminInCookie && adminInCookie.userType=="ADMIN";
    if(!isAdminLoggedIn){
        return redirect('/admin/login');
    }
}