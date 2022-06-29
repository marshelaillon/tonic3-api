const adminService = require('../services/adminService');

class adminController {
  static async addGuest(req, res) {
    // if (req.user.isAdmin) {
    const { error, data } = await adminService.addGuest(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
    // } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async removeGuest(req, res) {
    // if (req.user.isAdmin) {
    const { error, data } = await adminService.removeGuest(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
    // } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async getAllGuests(req, res) {
    // if (req.user.isAdmin) {
    const { error, data } = await adminService.getAllGuests();
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
    // } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async addEvent(req, res) {
    // if (req.user.isAdmin) {
    const { error, data } = await adminService.addEvent(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
    // } else res.status(403).json({ data: 'Unauthorized user' });
  }

  static async editEvent(req, res) {
    // if (req.user.isAdmin) {
    const { error, data } = await adminService.editEvent(
      req.body,
      req.params.id
    );
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
    // } else res.status(403).json({ data: 'Unauthorized user' });
  }
}

module.exports = adminController;
