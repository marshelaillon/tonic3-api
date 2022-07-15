const adminService = require('../services/adminService');

class adminController {
  static async addGuest(req, res) {
    if (req.user.isAdmin) {
      const { error, data } = await adminService.addGuest(req.body);
      if (error) return res.status(400).json({ data });
      res.status(200).json({ data });
    } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async removeGuest(req, res) {
    if (req.user.isAdmin) {
      const { error, data } = await adminService.removeGuest(req.params.id);
      if (error) return res.status(400).json({ data });
      res.status(200).json(data);
    } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async getAllGuests(req, res) {
    if (req.user.isAdmin) {
      const { error, data } = await adminService.getAllGuests();
      if (error) return res.status(400).json({ data });
      res.status(200).json({ data });
    } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async sendInvitations(req, res) {
    if (req.user.isAdmin) {
      const { error, data } = await adminService.sendInvitations();
      if (error) return res.status(400).json({ data });
      res.status(200).json({ data });
    } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async addEvent(req, res) {
    if (req.user.isAdmin) {
      const { error, data } = await adminService.addEvent(req.body);
      if (error) return res.status(400).json({ data });
      res.status(200).json({ data });
    } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async getAllEvents(req, res) {
    if (req.user.isAdmin) {
      const { error, data } = await adminService.getAllEvents();
      if (error) return res.status(400).json({ data });
      res.status(200).json({ data });
    } else res.status(403).json({ data: 'Unauthorized user' });

    // const data = {
    //   count: 1,
    //   rows: [{ email: 'evento@', register: 'no', send: true, event: 500 }],
    // };
    // res.status(200).json({ data });
  }

  static async editEvent(req, res) {
    if (req.user.isAdmin) {
      const { error, data } = await adminService.editEvent(
        req.body,
        req.params.id
      );
      if (error) return res.status(400).json({ data });
      res.status(200).json({ data });
    } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async getAllUsers(req, res) {
    if (req.user.isAdmin) {
      const { error, data } = await adminService.getAllUsers();
      if (error) return res.status(400).json({ data });
      res.status(200).json({ data });
    } else res.status(403).json({ data: 'Unauthorized user' });

    // const data = {
    //   count: 1,
    //   rows: [{ email: 'pepito@', register: 'si', send: false, event: 1 }],
    // };
    // res.status(200).json({ data });
  }

  static async removeEvent(req, res) {
    if (req.user.isAdmin) {
      const { error, data } = await adminService.removeEvent(req.params.id);
      if (error) return res.status(400).json({ data });
      res.status(200).json(data);
    } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async editUser(req, res) {

    if (req.user.isAdmin) {
      const { error, data } = await adminService.editUser(req.params.id);
      if (error) return res.status(400).json({ data });
      res.status(200).json(data);
    } else res.status(401).json({ data: 'Unauthorized user' });
  }
}

module.exports = adminController;
