/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.escapeVelocity = (req, res) => {
  res.render('escape-velocity', {
    title: 'Landing Page'
  });
};