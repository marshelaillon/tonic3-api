const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const generateToken = require('../utils/utils');

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
    if (error) return res.status(400).json({ data });

    const token = generateToken(data.id);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 * 7,
    });
    res.status(200).json({ data });
  }

  // @desc    Logout user
  // @route   GET /api/users/logout
  // @access  Private
  static async logoutUser(req, res) {
    res.cookie('token', '', { maxAge: 1 });
    res.status(201).send({});
  }

  // @desc    Persist user session
  // @route   GET /api/users/me
  // @access  Private
  static async getMe(req, res) {
    const { error, data } = await UserService.getMe(req.user);
    if (error) return res.status(400).json({ data });
    res.status(200).json({ data });
  }

  // @desc    Register a new user
  // @route   POST /api/users/register
  // @access  Public
  static async userUpdate(req, res) {
    const { error, data } = await UserService.userUpdate(
      req.body,
      req.params.id
    );
    if (error) return res.status(400).json(data);
    res.status(200).json(data);
  }

  // @desc    Register a new user
  // @route   POST /api/users/register
  // @access  Public & (private¿?)
  static async removeUser(req, res) {
    const { error, data } = await UserService.removeUser(req.params.id);
    if (error) return res.status(400).json(data);
    res.status(200).json(data);
  }

  // @desc    Register a new user
  // @route   POST /api/users/register
  // @access  private
  static async getUsers(req, res) {
    const { error, data } = await UserService.getUsers(req.user);
    if (error) return res.status(401).json(data);
    res.status(200).json(data);
  }
}

module.exports = UserController;
