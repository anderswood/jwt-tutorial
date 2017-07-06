// =================================================================
// require all necessary packages  =================================
// =================================================================

const express = require('express');
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');




// =================================================================
// app setup & configuration =======================================
// =================================================================

app.locals.privatePhotos = [
  { id: 1, photo: 'foo.img', desc: 'Lorem ipsum dolor set amet' },
  { id: 2, photo: 'bar.img', desc: 'Consequetar adipscing' },
  { id: 3, photo: 'baz.img', desc: 'Nun ellum ipsum dolor'  },
  { id: 4, photo: 'quuz.img', desc: 'Adipscing lorem set nun'  }
];

app.use(cors());
app.set('port', process.env.PORT || 3000);

// Store our SECRET KEY in a variable for use later on
app.set('secretKey', process.env.SECRET);

// Hardcode a USERNAME and PASSWORD for demo purposes only
app.set('username', 'brittany');
app.set('password', 'hello');




// =================================================================
// helper function for checking authentication =====================
// =================================================================

const checkAuth = (request, response, next) => {

  const token = ((request.body) ? request.body.token : undefined) ||
                request.query.token ||
                request.headers.authorization;

  // If a token is found, decode and verify it
  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {

      // If the token is invalid or expired, respond with an error
      if (error) {
        return response.status(403).json({
          success: false,
          message: 'Invalid authorization token.'
        });
      }

      // If the token is valid, save the decoded version to the
      // request for use in other routes & continue on with next()
      else {
        request.decoded = decoded;
        next();
      }
    });
  }

  // If no token is found, respond with a 403 Forbidden error
  else {
    return response.status(403).json({
      success: false,
      message: 'You must be authorized to hit this endpoint'
    });
  }
}




// =================================================================
// API endpoints ===================================================
// =================================================================

app.get('/api/v1/privatePhotos', checkAuth, (request, response) => {
  response.send(app.locals.privatePhotos);
});



// =================================================================
// start the server ================================================
// =================================================================

app.listen(app.get('port'), () => {
  console.log(`Server running on ${app.get('port')}`);
});
