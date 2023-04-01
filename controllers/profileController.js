const { render } = require('ejs');
const Profile = require('../models/Profile');
const User = require('../models/User');

exports.home = async function(req, res){
    if(req.session.user.avatar){
        try{
          renderAv = await User.renderAvatar(req.session.user._id);
          res.render('profile', renderAv);
        }catch(err){
          throw "ProfileController home: " + err;
        }
      }else{
        res.render('profile', {regErrors: req.flash('regErrors')});
      }
}