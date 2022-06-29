const guestService = require('../services/guestService');

class guestController {
  static async addGuest(req, res) {
    const { error, data } = await guestService.addGuest(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }

  // cambiar nombre al metodo y hacer que devuelva algo tipo {verified:true/false, checked: true/false};
  static async verifyGuest(req, res) {
    const { error, data } = await guestService.verifyGuest(req.body);
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
