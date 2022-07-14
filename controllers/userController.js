const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
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
    console.log('data del back...!!!!', { data });
    if (error) return res.sendStatus(400);

    const token = generateToken(data.id);
    /*     res.cookie('token', token, {
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 * 7,
      sameSite: 'none',
      secure: true,
    }); */
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
    res.status(200).json({ data });
  }

  // @desc    Register a new user
  // @route   POST /api/users/register
  // @access  Public
  static async userUpdate(req, res) {
    console.log('ESTO ES EL FILE DE CONTROLLER', req.file);
    const { error, data } = await UserService.userUpdate(
      req.body,
      req.file,
      req.params.id
    );
    if (error) return res.status(400).json(data);
    res.status(200).json(data);
  }

  // @desc    Remove a new user
  // @route   POST /api/users/register
  // @access  Public & (private¿?)
  static async removeUser(req, res) {
    const { error, data } = await UserService.removeUser(req.params.id);
    if (error) return res.status(400).json(data);
    res.status(200).json(data);
  }

  // @desc    Get all users
  // @route   POST /api/users/register
  // @access  private
  static async getUsers(req, res) {
    const { error, data } = await UserService.getUsers(req.user);
    if (error) return res.status(401).json(data);
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
    const { error, data } = await UserService.getEvents(req.user.email);
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

  // upload image control
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('FILE EN DESTINATION', file);
    cb(null, 'static/images');
  },
  filename: (req, file, cb) => {
    const randomGenerate = Date.now() + '-' + String(Math.round(Math.random())); // 02/07/2022-5.extension
    cb(null, randomGenerate + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
}).single('image');

module.exports = { UserController, uploadFile: upload };
