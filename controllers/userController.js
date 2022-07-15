const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const generateToken = require('../utils/generateToken');

class UserController {
  // @desc    Register a new user
  // @route   POST /api/users/register
  // @access  Public
  static async registerUser(req, res) {
    const { error, data } = await UserService.registerUser(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }

  // @desc    Authenticate a user
  // @route   POST /api/users/login
  // @access  Public
  static async loginUser(req, res) {
    const { error, data } = await UserService.loginUser(req.body);
    if (error) return res.sendStatus(400);

    const token = generateToken(data.id);
    res.status(200).json({ ...data, token });
  }

  // @desc    Logout user
  // @route   GET /api/users/logout
  // @access  Private
  static async logoutUser(req, res) {
    //res.cookie('token', '', { maxAge: 1 });
    req.user = null;
    res.status(200).send({ message: 'Logout successful' });
  }

  // @desc    Persist user session
  // @route   GET /api/users/me
  // @access  Private
  static async getMe(req, res) {
    const { error, data } = await UserService.getMe(req.user);
    if (error) return res.status(403).json({ data });
    res.status(200).json({ data });
  }

  // @desc    Generate a link to change the password
  // @route   POST /api/users/forgot-password
  // @access  Public
  static async forgotPassword(req, res) {
    const { email } = req.body;
    const { error, data } = await UserService.forgotPassword(email);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }

  // @desc    Create a new password
  // @route   POST /api/users/:id/new-password
  // @access  Public/Private
  static async createNewPassword(req, res) {
    const newPassword = req.body.password;
    const { id } = req.params;
    const { error, data } = await UserService.createNewPassword(
      newPassword,
      id
    );
    if (error) return res.status(400).json({ data });
    res.status(200).json(data);
  }

  // @desc    Update the user's information
  // @route   POST /api/users/update
  // @access  Private
  static async userUpdate(req, res) {
    const { error, data } = await UserService.userUpdate(req.body);
    if (error) return res.status(400).json(data);
    res.status(200).json(data);
  }

  // @desc    Remove a new user
  // @route   POST /api/users/register
  // @access  Private
  static async removeUser(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { error, data } = await UserService.removeUser(req.params.id);
    if (error) return res.status(400).json(data);
    res.status(200).json(data);
  }

  static async verifyEmail(req, res) {
    const { error, data } = await UserService.verifyEmail(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }

  static async verifyToken(req, res) {
    const { error, data } = await UserService.verifyToken(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }

  static async updateToken(req, res) {
    const { error, data } = await UserService.updateToken(req.body);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }

  // @desc    Get all events of a user
  // @route   GET /api/users/events
  // @access  private
  static async getEvents(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { error, data } = await UserService.getEvents(req.user);
    if (error) return res.status(400).json(data);
    res.status(200).json(data);
  }

  // @desc    Get an events of a user
  // @route   GET /api/users/events/:id
  // @access  private
  static async getEventById(req, res) {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { error, data } = await UserService.getEventById(
      req.params.id,
      req.user.email
    );
    if (error) return res.status(400).json(data);
    res.status(200).json(data);
  }
}

module.exports = UserController;
