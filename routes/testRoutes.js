import express from 'express';
import { isAdmin, isSuperAdmin, isOwner, isAuth } from '../utils.js';

const router = express.Router();

// Example route accessible only by admin
router.get('/admin', isAuth, isAdmin, (req, res) => {
  res.send({ route: 'admin' });
});

// Example route accessible only by superadmin
router.get('/superadmin', isAuth, isSuperAdmin, (req, res) => {
  res.send({ route: 'superadmin' });
});

// Example route accessible only by owner 
router.get('/owner', isAuth, isOwner, (req, res) => {
  res.send({ route: 'owner' });
});

// Route to get all accessible routes for the user
router.get('/accessible-routes', isAuth, (req, res) => {
  const routes = [];
  if (req.user) {
    if (isAdmin(req.user)) {
      routes.push('admin');
    }
    if (isSuperAdmin(req.user)) {
      routes.push('superadmin');
    }
    if (isOwner(req.user)) {
      routes.push('owner');
    }
  }
  res.send({ routes });
});

export default router;
