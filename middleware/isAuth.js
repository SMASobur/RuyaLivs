export default function ({ app, error,redirect }) {
    const hasToken = !!app.$apolloHelpers.getToken()
    if (!hasToken) {
        // console.log('app',app.$router);
        // error({ errorCode: 503, message: 'You are not allowed to see this' })
        return redirect('/');
    }
}