
function isAuthenticated(req, res, next) {
    req.user = { googleId: 'testGoogleId' };  // Simulate an authenticated user
    next();
}

module.exports = {
    isAuthenticated
};