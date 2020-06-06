/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};

exports.stellar = (req, res) => {
  res.render('stellar', {
    title: 'Landing Page'
  });
};