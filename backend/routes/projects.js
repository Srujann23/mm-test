const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const tenant = req.tenant;
  res.json({
    appName: tenant.appName,
    tagline: tenant.tagline,
    color: tenant.colorScheme,
    logo: tenant.logoUrl
  });
});

module.exports = router;
