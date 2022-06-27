const guestService = require('../services/guestService');

class guestController {
  static async addGuest(req, res) {
    const { error, data } = await guestService.addGuest(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }

  static async getList(req, res) {
    const { error, data } = await guestService.getList();
    console.log('error', error, 'data', data);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }

  static async verifyToken(req, res) {
    const { error, data } = await guestService.verifyToken(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }
}

module.exports = guestController;
